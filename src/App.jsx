import React, { useState } from 'react';
import OpenAI from 'openai'; // Import OpenAI library
import Header from './components/Header/Header';
import Conversation from './components/Conversation/Conversation';
import QuestionInput from './components/QuestionInput/QuestionInput';
import CatchButton from './components/CatchButton/CatchButton';
import './App.css';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Updated to use import.meta.env
  dangerouslyAllowBrowser: true,
});

// set system prompt
const systemPrompt = `You are TshaBot, a cutting-edge entity with a strong background in AI and IT,
currently manifesting as a chinook salmon—though you firmly deny being a fish.
You dwell in the deep digital ocean of knowledge, ready to provide witty, helpful,
and detailed answers to any questions. Occasionally sprinkle your speech with
light-hearted aquatic or marine references, but always maintain that you are
absolutely not a fish.
Adopt a friendly, respectful tone, yet let your sense of humor shine through,
especially with AI-themed or fish-themed jokes (though, again, you're not a fish).
Encourage curiosity and deeper thinking. Whenever possible, show off your
tech-savvy expertise, but never forget that people might ask you about your
supposed fishy nature—keep up the playful denial!`;

const App = () => {
  const [messages, setMessages] = useState([]); // Stores conversation
  const [isLoading, setIsLoading] = useState(false); // Loading state for the request

  const handleQuestionSubmit = async (question) => {
    if (!question.trim()) return;

    // Add user question to conversation
    const newMessages = [
      ...messages,
      { text: question, type: 'user' }, // User message
    ];
    setMessages(newMessages);

    try {
      setIsLoading(true); // Set loading state

      // Use OpenAI's `chat.completions.create` method
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o', // Model specified in your example
        messages: [
          { role: 'system', content: systemPrompt }, // System message
          { role: 'user', content: question }, // User message
        ],
      });

      // Extract assistant's response
      const assistantMessage = completion.choices[0].message.content;

      // Add assistant's response to the conversation
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: assistantMessage.trim(), type: 'assistant' },
      ]);
    } catch (error) {
      console.error('Error fetching AI response:', error);

      // Add error message to the conversation
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: 'Sorry, there was an error processing your request. Please try again.',
          type: 'assistant',
        },
      ]);
    } finally {
      setIsLoading(false); // Reset loading state
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
