import React from "react";
import { Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/:username" element={<UserPage />}></Route>
        <Route path="/:username/post/:id" element={<PostPage />}></Route>
      </Routes>
    </>
  );
};

export default App;
