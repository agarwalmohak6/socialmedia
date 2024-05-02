import React from "react";

const Home = () => {
  return (
    <div className="home-page">
      <div className="title">
        <h1 className="app-name">MySocial</h1>
      </div>
      <div className="background-image"></div>
      <div className="content">
        <div className="features">
          <div className="feature">
            <i className="fas fa-camera"></i>
            <p>Create Posts</p>
          </div>
          <div className="feature">
            <i className="fas fa-user-friends"></i>
            <p>Add Friends</p>
          </div>
          <div className="feature">
            <i className="fas fa-comments"></i>
            <p>Chat Feature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
