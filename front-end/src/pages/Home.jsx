import React, { useState, useEffect } from 'react';
import './Home.css'; // Ensure this path is correct based on your project structure

import logo from "./../Public/Photos/Logo.png"; // Adjust the path as needed
import Soccer from "./../Public/Videos/Soccer.mp4";
import Basketball from "./../Public/Videos/Basketball.mp4";
import Tennis from "./../Public/Videos/Tenis.mp4"; // Assuming typo fixed from Tenis to Tennis
import Run from "./../Public/Videos/Run.mp4";

function Home() {
    // Create an array of video sources
    const videos = [Soccer, Basketball, Tennis, Run];
    
    // useState to hold the selected video
    const [selectedVideo, setSelectedVideo] = useState(videos[0]); // Default to the first video

    // useEffect to randomize the video on component mount
    useEffect(() => {
        // Randomly select a video
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        setSelectedVideo(randomVideo);
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div className="home-container">
            <video autoPlay loop muted className="background-video">
                <source src={selectedVideo} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
            <div className="home-content">
                <img src={logo} alt="Logo" className="logo-image"/>
                <h1>Move NYC!!</h1>
                <p>Get Healthy, Get Moving, Get Move NYC!</p>
            </div>
        </div>
    );
}

    export default Home;