import React, { useState } from 'react';
import './QuestionInput.css';

const QuestionInput = ({ onSubmit }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
      setQuestion('');
    }
  };

  return (
    <form className="input-wrapper" onSubmit={handleSubmit}>
      <div className="input-container">
        <input
          type="text"
          className="question-input"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
    </form>
  );
};

export default QuestionInput;
