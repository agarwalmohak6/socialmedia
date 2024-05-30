/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../helper/axiosInstance";

const GetFriends = () => {
  const [friends, setFriends] = useState([]);
  const [addFriend, setAddFriend] = useState("");
  const token = localStorage.getItem("token");
  const curr_name = localStorage.getItem("username");
  const decoded = token ? jwtDecode(token) : {};

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/friends/${decoded?.userId}`
        );
        setFriends(response.data.friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, [decoded]);

  const handleChatFriend = async (friendUsername) => {
    try {
      const usernames = [curr_name, friendUsername].sort();
      const roomName = `${usernames[0]}_${usernames[1]}`;
      navigate(`/chat/${roomName}`);
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  };

  const handleAddFriend = async (username) => {
    try {
      const res1 = await axios.get(
        `http://localhost:5000/api/users/profile/${username}`
      );
      console.log(res1);
      if (!res1.data) {
        alert("User not found");
        setAddFriend("");
      } else {
        const response = await axiosInstance.post(
          `/users/follow/${res1.data._id}`
        );
        console.log(response);
        if (response.status === 200) {
          setFriends((prevFriends) => [
            ...prevFriends,
            {
              id: res1.data._id,
              name: res1.data.name,
              username: res1.data.username,
            },
          ]);
          setAddFriend("");
        }
      }
    } catch (error) {
      console.log("Error in adding friend ", error);
    }
  };

  return (
    <div className="friends-list">
      <input
        type="text"
        value={addFriend}
        name="addFriend"
        onChange={(e) => {
          setAddFriend(e.target.value);
        }}
      />
      <button onClick={() => handleAddFriend(addFriend)}>
        Add Friend
      </button>
      <h2>Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} className="friend-item">
            <div className="friend-info">
              <span className="friend-name">{friend.name}</span>
              <span className="friend-username">@{friend.username}</span>
            </div>
            <button
              onClick={() => handleAddFriend(friend.username)}
              className="remove-friend-button"
            >
              Remove Friend
            </button>
            <button
              onClick={() => handleChatFriend(friend.username)}
              className="add-friend-button"
            >
              Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetFriends;
