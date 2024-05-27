import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { roomname } = useParams();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on("messageResponse", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Handle connection
    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server");
    });

    // Handle disconnection
    newSocket.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log(`Disconnected: ${reason}`);
    });

    // Listen for join and leave notifications
    newSocket.on("userJoinedRoom", (room) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        `User joined room: ${room}`,
      ]);
    });
    newSocket.on("userLeftRoom", (room) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        `User left room: ${room}`,
      ]);
    });

    return () => {
      newSocket.off("messageResponse");
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("userJoinedRoom");
      newSocket.off("userLeftRoom");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && roomname) {
      socket.emit("joinRoom", roomname);
      setJoinedRoom(roomname);
    }
  }, [socket, roomname]);

  const joinRoom = () => {
    if (socket && room.trim() !== "") {
      socket.emit("joinRoom", room);
      setJoinedRoom(room);
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
      <div className="room-input">
        {!roomname && (
          <>
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
          </>
        )}
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
