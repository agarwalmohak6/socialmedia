import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");

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

      // Listen for join and leave notifications
      socket.on("userJoinedRoom", (room) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          `User joined room: ${room}`,
        ]);
      });
      socket.on("userLeftRoom", (room) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          `User left room: ${room}`,
        ]);
      });

      return () => {
        socket.off("messageResponse");
        socket.off("connect");
        socket.off("disconnect");
        socket.off("userJoinedRoom");
        socket.off("userLeftRoom");
      };
    }
  }, [socket]);

  const connectSocket = () => {
    const newSocket = io("http://localhost:4000");
    newSocket.connect();
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setJoinedRoom("");
    }
  };

  const joinRoom = () => {
    if (socket && room.trim() !== "") {
      socket.emit("joinRoom", room);
      setJoinedRoom(room);
    }
  };

  const leaveRoom = () => {
    if (socket && joinedRoom) {
      socket.emit("leaveRoom", joinedRoom);
      setJoinedRoom("");
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "" && socket) {
      if (joinedRoom !== "") {
        socket.emit("message", { room: joinedRoom, message });
      } else {
        socket.emit("message", { room: null, message });
      }
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
      <div className="room-input">
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room name"
          disabled={!isConnected || joinedRoom !== ""}
        />
        <button
          onClick={joinRoom}
          disabled={!isConnected || room.trim() === "" || joinedRoom !== ""}
        >
          Join Room
        </button>
        <button
          onClick={leaveRoom}
          disabled={!isConnected || joinedRoom === ""}
        >
          Leave Room
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
