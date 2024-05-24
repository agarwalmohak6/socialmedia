// src/components/Chat.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on("messageResponse", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Handle connection
      socket.on("connect", () => {
        setIsConnected(true);
        console.log("Connected to server");
      });

      // Handle disconnection
      socket.on("disconnect", (reason) => {
        setIsConnected(false);
        console.log(`Disconnected: ${reason}`);
      });

      return () => {
        socket.off("messageResponse");
        socket.off("connect");
        socket.off("disconnect");
      };
    }
  }, [socket]);

  const connectSocket = () => {
    const newSocket = io("http://localhost:4000", {
      autoConnect: false, // Prevent auto connection
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    newSocket.connect();
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "" && socket) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="connection-buttons">
        <button onClick={connectSocket} disabled={isConnected}>
          Connect
        </button>
        <button onClick={disconnectSocket} disabled={!isConnected}>
          Disconnect
        </button>
      </div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        className="chat-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        disabled={!isConnected}
      />
      <button
        className="chat-button"
        onClick={sendMessage}
        disabled={!isConnected}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
