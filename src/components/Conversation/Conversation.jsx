import React, { useEffect, useRef } from 'react';
import './Conversation.css';

const Conversation = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="conversation">
      {messages.map((msg, index) => (
        <div key={index} className={`bubble ${msg.type}`}>
          {msg.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default Conversation;
