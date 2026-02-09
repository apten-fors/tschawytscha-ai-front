import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Conversation from './components/Conversation/Conversation';
import QuestionInput from './components/QuestionInput/QuestionInput';
import CatchButton from './components/CatchButton/CatchButton';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    // Get token when app starts
    fetch('/api/init', {
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setInitError('Authentication failed. Please try again later.');
      }
    })
    .catch(error => {
      console.error('Initialization error:', error);
      setInitError('Failed to connect to the server. Please check your connection.');
    })
    .finally(() => setIsLoading(false));
  }, []);

  const handleQuestionSubmit = async () => {
    if (!isAuthenticated) return;

    if (!currentQuestion.trim()) return;

    const newMessages = [
      ...messages,
      { text: currentQuestion, type: 'user' },
    ];
    setMessages(newMessages);
    setCurrentQuestion('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important! For sending cookies
        body: JSON.stringify({
          messages: newMessages,
          question: currentQuestion,
        }),
      });

      if (response.status === 401) {
        // If token expired, try to get a new one
        setIsAuthenticated(false);
        window.location.reload();
        return;
      }

      // Add better error handling
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType}. Status: ${response.status}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      if (!data || !data.answer) {
        throw new Error('Invalid response format from API');
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.answer, type: 'assistant' },
      ]);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: `Error: ${error.message}. Please check the console for more details.`,
          type: 'assistant',
        },
      ]);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="app">
        <div className="container loading-view">
          <div className="loading-spinner-app"></div>
          <p className="loading-text-app">Initializing application...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (initError) {
    return (
      <div className="app">
        <div className="container error-view">
          <Header minimal={true} />
          <div className="error-message">
            <h2>Connection Error</h2>
            <p>{initError}</p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render authentication error
  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="container error-view">
          <Header minimal={true} />
          <div className="error-message">
            <h2>Authentication Failed</h2>
            <p>Failed to initialize the application. Please try again later.</p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main application view
  return (
    <div className="app">
      <div className="container">
        <Header />
        <Conversation messages={messages} />
        <QuestionInput
          value={currentQuestion}
          onChange={setCurrentQuestion}
          onSubmit={handleQuestionSubmit}
        />
        <CatchButton
          onClick={handleQuestionSubmit}
          disabled={isLoading || !currentQuestion.trim()}
        />
        <footer className="footer">
          <p>made by <a href="https://apten.im" target="_blank" rel="noopener noreferrer">@apten-fors</a></p>
        </footer>
      </div>
    </div>
  );
};

export default App;
