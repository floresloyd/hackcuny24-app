import React, { useState, useEffect } from 'react';
import './Home.css'; // Make sure this path matches the location of your CSS file
import '../components/LearnMore.jsx';

// Import your videos and logo
import logo from "./../Public/Photos/Logo.png"; // Update path as needed
import Soccer from '../Public/Videos/Soccer.mp4';
import Basketball from '../Public/Videos/Basketball.mp4';
import Tennis from '../Public/Videos/Tennis.mp4';
import Run from '../Public/Videos/Run.mp4';

function Home() {
    // Array of video sources
    const videos = [Soccer, Basketball, Tennis, Run];
    
    // useState to hold the selected video URL
    const [selectedVideo, setSelectedVideo] = useState('');

    // useEffect to select a random video on component mount
    useEffect(() => {
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        setSelectedVideo(randomVideo);
    }, [videos]);

    return (
        <div className="home-container">
            {selectedVideo && (
                <video autoPlay loop muted className="background-video">
                    <source src={selectedVideo} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
            )}
            <div className="home-content">
                <img src={logo} alt="Logo" className="logo-image"/>
                <p className="home-text">Get Healthy, Get Connected, Get Move NYC!</p>
            </div>
    </div>
  );
}
export default Home;
