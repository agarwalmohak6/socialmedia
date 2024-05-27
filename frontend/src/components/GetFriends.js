import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const GetFriends = () => {
  const [friends, setFriends] = useState([]);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetFriends;
