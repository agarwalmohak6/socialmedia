import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    profilePic: "",
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send form data to the backend API endpoint
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        formData
      );
      console.log(response.data); // Log response from the server
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        profilePic: "",
        bio: "",
      });
    } catch (error) {
      console.error(error); // Handle error
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form-field">
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="profilePic"
          placeholder="Enter profile picture URL"
          value={formData.profilePic}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          placeholder="Enter bio"
          value={formData.bio}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
