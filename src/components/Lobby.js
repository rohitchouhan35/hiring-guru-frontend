import React, { useState } from "react";

const Lobby = ({ onSubscribe, onPublishMessage }) => {
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const handleSubscribe = () => {
    // Subscribe to a Stomp topic
    onSubscribe({
      topic: "/all/messages",
      onMessage: (message) => {
        // Handle incoming messages
        setReceivedMessages((prevMessages) => [...prevMessages, message.body]);
      },
    });
  };

  const handleSendMessage = () => {
    // Publish a message to the Stomp destination
    onPublishMessage("/app/application", message);
    setMessage("");
  };

  return (
    <div>
      <h2>Lobby</h2>
      <button onClick={handleSubscribe}>Subscribe to Lobby</button>
      <div>
        <h3>Received Messages</h3>
        <ul>
          {receivedMessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Send Message</h3>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Lobby;
