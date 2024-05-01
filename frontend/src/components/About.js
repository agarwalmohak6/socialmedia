import React, { useEffect, useState } from "react";
import axios from "axios";
// import { jwtDecode } from "jwt-decode";

const About = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    //   if (!token) {
    //     console.log("Token missing in frontend");
    //     return;
    //   }
    //   const decoded = jwtDecode(token);
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/profile/${username}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="container">
      <h1 className="title">About Us</h1>
      {user && (
        <div className="user-details">
          <h2>User Details</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
        </div>
      )}
    </div>
  );
};

export default About;
