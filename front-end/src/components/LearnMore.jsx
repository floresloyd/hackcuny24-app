import React from 'react';
import './LearnMore.css';

// Import images
import photo1 from "./../Public/Photos/Photo-1.png";
import photo2 from "./../Public/Photos/Photo-2.png";
import photo3 from "./../Public/Photos/Photo-3.png";

function LearnMore() {
  return (
    <div className="learn-more-container">
      <p>Welcome to "Move NYC!", your go-to app for discovering and engaging in physical activities across the vibrant boroughs of New York City. Born from a vision to foster community connections through the joy of movement, our app is dedicated to bringing New Yorkers together, regardless of their fitness level or preferred activity.</p>
      <img src={photo1} alt="Activity in NYC" />

      <p>In a city as bustling and diverse as NYC, finding like-minded individuals who share your passion for physical activities can be challenging. Whether you're a runner looking for a partner to pace through Central Park, a yogi in search of group sessions by the East River, or someone keen to explore the city's hidden hiking trails with a group, "Move NYC!" makes these connections happen.</p>
      <img src={photo2} alt="Connecting through activities" />

      <p>Our mission is to promote a healthier, more active lifestyle while taking full advantage of the urban playground that is New York City. We believe in the power of community to motivate and inspire, turning every borough into a space of endless physical activity possibilities. From organized sports events to impromptu dance classes under the Brooklyn Bridge, "Move NYC!" is your portal to a world of movement. Join us to explore, connect, and move. Together, we'll make every corner of NYC our gym, our yoga studio, and our running track. It's time to get moving, New York!</p>
      <img src={photo3} alt="NYC as your playground" />
    </div>
  );
}

export default LearnMore;
