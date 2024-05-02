import React from "react";
import { Route, Routes } from "react-router-dom";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import PostsPage from "./components/PostsPage";

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
          path="/contact"
          element={
            <>
              <ResponsiveAppBar />
              <Contact />
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
        {/* Add more routes as needed */}
      </Routes>
    </>
  );
}

export default App;
