import React, { useState, useEffect } from "react";
import axios from "axios";

const About = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/profile/mohak123"
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="about-container">
      <h2 className="about-heading">About Me</h2>
      {userData && (
        <div>
          <div className="about-info">
            <span className="about-label">Name:</span>
            <span className="about-value">{userData.name}</span>
          </div>
          <div className="about-info">
            <span className="about-label">Username:</span>
            <span className="about-value">{userData.username}</span>
          </div>
          <div className="about-info">
            <span className="about-label">Email:</span>
            <span className="about-value">{userData.email}</span>
          </div>
          <div className="about-info">
            <span className="about-label">Profile Picture:</span>
            <span className="about-value">{userData.profilePic}</span>
          </div>
          <div className="about-info">
            <span className="about-label">Bio:</span>
            <span className="about-value">{userData.bio}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
