import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../helper/axiosInstance";
import { Toaster, toast } from "react-hot-toast";

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
  }, [decoded.userId]);

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
        toast.error("User not found");
        setAddFriend("");
      } else {
        const response = await axiosInstance.post(
          `/users/follow/${res1.data._id}`
        );
        console.log(response);
        if (response.status === 200) {
          toast.success("Added a friend");
          setFriends((prevFriends) => [
            ...prevFriends,
            {
              id: res1.data._id,
              name: res1.data.name,
              username: res1.data.username,
            },
          ]);
        }
        setAddFriend("");
      }
    } catch (error) {
      if (error.response && error.response.status === 409)
        toast.error("You already follow this user");
      else if (error.response && error.response.status === 400)
        toast.error("You can't add yourself as a friend");
      console.log("Error in adding friend ", error);
    }
  };
  const handleRemoveFriend = async (username) => {
    try {
      const res1 = await axios.get(
        `http://localhost:5000/api/users/profile/${username}`
      );
      const response = await axiosInstance.post(
        `/users/unfollow/${res1.data._id}`
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Removed a friend");
        setFriends((prevFriends) => [
          prevFriends,
          {
            id: res1.data._id,
            name: res1.data.name,
            username: res1.data.username,
          },
        ]);
      }
    } catch (error) {
      console.log("Error in removing friend ", error);
    }
  };

  return (
    <div className="friends-list">
      <Toaster />
      <input
        type="text"
        value={addFriend}
        name="addFriend"
        onChange={(e) => {
          setAddFriend(e.target.value);
        }}
      />
      <button onClick={() => handleAddFriend(addFriend)}>Add Friend</button>
      <h2>Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} className="friend-item">
            <div className="friend-info">
              <span className="friend-name">{friend.name}</span>
              <span className="friend-username">@{friend.username}</span>
            </div>
            <div>
              <button onClick={() => handleRemoveFriend(friend.username)}>
                Remove Friend
              </button>
              <button onClick={() => handleChatFriend(friend.username)}>
                Chat
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetFriends;
