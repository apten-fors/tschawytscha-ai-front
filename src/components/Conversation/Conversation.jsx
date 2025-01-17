import React from 'react';
import './Conversation.css';

const Conversation = ({ messages }) => (
  <div className="conversation">
    {messages.map((msg, index) => (
      <div key={index} className={`bubble ${msg.type}`}>
        {msg.text}
      </div>
    ))}
  </div>
);

export default Conversation;
