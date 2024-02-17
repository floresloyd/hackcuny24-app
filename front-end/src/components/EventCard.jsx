/* eslint-disable react/prop-types */
// EventCard.js
import "./EventCard.css";

function EventCard({ tag, title, description, author, date, addressLine1, addressLine2, city, zip, joined, maxJoined }) {
    const fullAddress = `${addressLine1} ${addressLine2}, ${city}, ${zip}`;

    return (
        
        <div className="event-card">
            <div className="event-header">
                <div className="event-tag">{tag}</div>
                <div className="event-location">
                    <div className="event-title">{title}</div>
                </div>
                <div className="event-joined">People Joined {joined}/{maxJoined}</div>
            </div>
            <div className="event-description">{description}</div>
            <div className="event-date">{date}</div>
            <div className="event-location">{fullAddress}</div>
            <div className="event-author">{author}</div>
            <button className="event-join-button">JOIN</button>
        </div>
    );
}

export default EventCard;