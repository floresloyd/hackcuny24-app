import React from 'react';
import './Analysis.css';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

// Import images
import Williams from "../Public/Photos/williamsburg.png" 
import Thomas from "../Public/Photos/thomas.png"
import Sunset from "../Public/Photos/sunset.png"
import Obesity from "../Public/Photos/obesity1.png"

function Analysis() {
    return (
        <div className="analysis-container">
            <div className="graph-container">
                <div className="bar-graph">
                    <img src={Obesity} alt="Obesity Bar Graph" />
                </div>
                <div className="graph-explanation">
                <h1> The bar graph reveals a concerning rise in obesity across NYC boroughs, with Queens
                    and brooklyn standing out at almost 50% of its population facing weight-related issues.</h1>
                <p> This
                    alarming trend highlights the urgent need for intervention. However, a glimmer of hope emerges from
                    other graphs showcasing diverse sports activities in popular parks. Beyond recreation, these activities
                    build a healthier community. Engaging in sports not only combats obesity but also promotes cardiovascular
                    health and community bonding. The key lies in fostering environments that encourage active living, turning parks
                    into hubs for collective well-being. By embracing this approach, we not only tackle
                    obesity but also nurture resilient,
                    interconnected communities.</p>
                </div>
            </div>
            <div className="carousel-container">
            <div className='carousel-text'>
                <h1> Since Brooklyn and Queens Have the highest Obesity rates</h1>
                <p> We've provided the most popular activities across different parks in the boroughs</p>
            </div>
            <div className='carousel-container'>
            <Carousel autoPlay showArrows showThumbs={false} infiniteLoop useKeyboardArrows>
                    <div>
                        <img src={Williams} className='pie-graph' alt="Williams' Picture" />
                    </div>
                    <div>
                        <img src={Thomas} className='pie-graph' alt="Thomas" />
                    </div>
                    <div>
                        <img src={Sunset} className='pie-graph' alt="Sunset" />
                    </div>
                </Carousel>
                </div>
            </div>
        </div>
    );
}

export default Analysis;
