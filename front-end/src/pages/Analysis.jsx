import React from 'react';
import "./Analysis.css";
import Williams from "../Public/Photos/williamsburg.png";
import Obesity from "../Public/Photos/obesity.png";
import sunset from "../Public/Photos/sunset.png";
import thomas from "../Public/Photos/thomas.png";

function Analysis() {
    const headerStyle = {
        position: 'relative',
        top: '20px', // You can adjust these values as needed
        left: '50px', // You can adjust these values as needed
    };

    const williamSize = {
        width: '800px',
        height: 'auto',
        position: 'relative',
        top: '300px', // Adjust these values as needed
        left: '20px', // Adjust these values as needed
    };
    const obesitySize = {
        width: '800px',
        height: 'auto',
        position: 'relative',
        top: '1050px', // Adjust these values as needed
        left: '500px', // Adjust these values as needed
    };
    const sunsetSize = {
        width: '800px',
        height: 'auto',
        position: 'relative',
        top: '300px', // Adjust these values as needed
        left: '10px', // Adjust these values as needed
    };
    const thomasSize = {
        width: '800px',
        height: 'auto',
        position: 'relative',
        top: '100px', // Adjust these values as needed
        left: '-300px', // Adjust these values as needed
    };

    const paragraphStyle = {
        position: 'absolute',
        left: '100px', // Adjust this value to position the paragraph to the most left
        top: '100px', // Adjust this value to control the vertical position of the paragraph
        width: '2200px', // Adjust this value to set the width of the paragraph container
        fontSize: '25px', // Adjust this value to set the font size
        textIndent: '30px'
    };

    return (
        <div>
            <h1 style={headerStyle}>Analysis</h1>
            <img src={Williams} alt="Williams' Picture" style={williamSize} />
            <img src={Obesity} alt="Obesity" style={obesitySize} />
            <img src={thomas} alt="Thomas" style={thomasSize} />
            <img src={sunset} alt="Sunset" style={sunsetSize} />

            <div style={paragraphStyle}>
                <p> The bar graph reveals a concerning rise in obesity across NYC boroughs, with Queens
                    and brooklyn standing out at almost 50% of its population facing weight-related issues. This
                    alarming trend highlights the urgent need for intervention. However, a glimmer of hope emerges from
                    other graphs showcasing diverse sports activities in popular parks. Beyond recreation, these activities
                    build a healthier community. Engaging in sports not only combats obesity but also promotes cardiovascular
                    health and community bonding. The key lies in fostering environments that encourage active living, turning parks
                    into hubs for collective well-being. By embracing this approach, we not only tackle
                    obesity but also nurture resilient,
                    interconnected communities.</p>
            </div>
        </div>
    );
}

export default Analysis;
