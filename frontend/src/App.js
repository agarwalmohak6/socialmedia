import React from "react";
import { Route, Routes } from "react-router-dom";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import PostsPage from "./components/PostsPage";
import CreatePost from "./components/CreatePost";
import Chat from "./components/Chat";
import GetFriends from "./components/GetFriends";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <ResponsiveAppBar />
              <Home />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <ResponsiveAppBar />
              <About />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <ResponsiveAppBar />
              <Login />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <ResponsiveAppBar />
              <Register />
            </>
          }
        />
        <Route
          path="/postsPage"
          element={
            <>
              <ResponsiveAppBar />
              <PostsPage />
            </>
          }
        />
        <Route
          path="/createPost"
          element={
            <>
              <ResponsiveAppBar />
              <CreatePost />
            </>
          }
        />
        <Route
          path="/friends"
          element={
            <>
              <ResponsiveAppBar />
              <GetFriends />
            </>
          }
        />
        <Route
          path="/chat"
          element={
            <>
              <ResponsiveAppBar />
              <Chat />
            </>
          }
        />
        <Route
          path="/chat/:roomname"
          element={
            <>
              <ResponsiveAppBar />
              <Chat />
            </>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </>
  );
}

export default App;
