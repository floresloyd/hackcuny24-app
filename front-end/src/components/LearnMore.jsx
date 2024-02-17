import React from 'react';
import './LearnMore.css';

// Import images
import photo1 from "./../Public/Photos/Photo-1.png";
import photo2 from "./../Public/Photos/Photo-2.png";
import photo3 from "./../Public/Photos/Photo-3.png";

function LearnMore() {
  return (
    <div className="learn-more-container">
      <div className="learn-more-section">
        <div className="learn-more-image">
          <img src={photo1} alt="Activity in NYC" />
        </div>
        <p className="learn-more-text">Welcome to "Move NYC!", your go-to app for discovering and engaging in physical activities across the vibrant boroughs of New York City. Born from a vision to foster community connections through the joy of movement, our app is dedicated to bringing New Yorkers together, regardless of their fitness level or preferred activity.</p>
      </div>

      <div className="learn-more-section">
        <div className="learn-more-image">
          <img src={photo2} alt="Connecting through activities" />
        </div>
        <p className="learn-more-text">In a city as bustling and diverse as NYC, finding like-minded individuals who share your passion for physical activities can be challenging. Whether you're a runner looking for a partner to pace through Central Park, a yogi in search of group sessions by the East River, or someone keen to explore the city's hidden hiking trails with a group, "Move NYC!" makes these connections happen.</p>
      </div>

      <div className="learn-more-section">
        <div className="learn-more-image">
          <img src={photo3} alt="NYC as your playground" />
        </div>
        <p className="learn-more-text">Our goal is to foster a vibrant, healthy lifestyle within the dynamic landscape of New York City. Through community-driven initiatives, we aim to transform every borough into a hub of physical activity. From sports events to spontaneous dance sessions, "Move NYC!" offers endless movement opportunities. Join us to discover, connect, and stay active. Let's turn every corner of NYC into our gym, yoga studio, and running track. Get moving with us, New York!</p>
      </div>
    </div>
  );
}

export default LearnMore;
