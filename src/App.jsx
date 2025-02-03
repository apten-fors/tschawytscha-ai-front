import React, { useState } from 'react';
import Header from './components/Header/Header';
import Conversation from './components/Conversation/Conversation';
import QuestionInput from './components/QuestionInput/QuestionInput';
import CatchButton from './components/CatchButton/CatchButton';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';  // Default fallback to /api

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');

  const handleQuestionSubmit = async () => {
    if (!currentQuestion.trim()) return;

    const newMessages = [
      ...messages,
      { text: currentQuestion, type: 'user' },
    ];
    setMessages(newMessages);
    setCurrentQuestion('');

    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          question: currentQuestion,
        }),
      });

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
    } finally {
      setIsLoading(false);
    }
  };

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
      </div>
    </div>
  );
};

export default App;
