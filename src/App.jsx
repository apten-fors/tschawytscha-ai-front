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

  const handleQuestionSubmit = async (question) => {
    if (!question.trim()) return;

    const newMessages = [
      ...messages,
      { text: question, type: 'user' },
    ];
    setMessages(newMessages);

    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/chat`, {  // Use the environment variable
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,  // Send full conversation history if needed
          question: question,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.answer, type: 'assistant' },  // Adjust based on your API response structure
      ]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: 'Sorry, there was an error processing your request. Please try again.',
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
        <QuestionInput onSubmit={handleQuestionSubmit} />
        <CatchButton
          onClick={() => handleQuestionSubmit(messages[messages.length - 1]?.text || '')}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default App;
