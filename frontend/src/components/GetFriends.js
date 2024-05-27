import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const GetFriends = () => {
  const [friends, setFriends] = useState([]);
  const token = localStorage.getItem("token");
  const curr_name = localStorage.getItem("username");
  const decoded = jwtDecode(token);
  console.log(decoded);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/friends/${decoded.userId}`
        );
        setFriends(response.data.friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [decoded]);

  const handleAddFriend = (friendUsername) => {
    const roomName = `${curr_name}_${friendUsername}`;
    navigate(`/chat/${roomName}`);
  };

  return (
    <div className="friends-list">
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
              className="add-friend-button"
            >
              Add Friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetFriends;
