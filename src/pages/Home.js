import React from 'react';
import './Pages.css';

function Home() {
  return (
    <div className="page home-page">
      <h2>Welcome to Home</h2>
      <p>This is the home page of our React application. Use the menu above to navigate to different sections.</p>
      <div className="content-box">
        <p>Start by clicking on one of the menu items to explore different pages.</p>
      </div>
    </div>
  );
}

export default Home;
