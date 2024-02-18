/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// EventCard.js

import { useEffect, useState } from "react";
import "./EventCard.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateDoc, doc, arrayUnion, getDoc, increment} from "firebase/firestore";


import Fireserver from "../Fireserver";
const { eventDatabase, userDataDatabase } = Fireserver;


function EventCard({
    id,
    tag,
    title,
    description,
    authorName,
    date,
    address_line1,
    address_line2,
    city,
    zip,
    joinedUsers, // Make sure this prop is passed from the parent component
    maxJoined, // Make sure this prop is passed from the parent component
    userUID,
    authorUID
    
  })  {
    const fullAddress = `${address_line1} ${address_line2}, ${city}, ${zip}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD7ItWkK5lPSvzHyUPw-63GQQHD8k-JGtM&q=${encodedAddress}`;

    
    const handleJoinEvent = async () => {
        if (userUID === authorUID) {
          alert("You cannot join your own event.");
          return;
        }

        if (joinedUsers.includes(userUID)) {
            alert("You have already joined this event.");
            return;
          }
        
          if (joinedUsers.length >= maxJoined) {
            alert("Event is full.");
            return;
        }
        
          // Update user's community points
          const userRef = doc(userDataDatabase, 'userDataDatabase', userUID);
          await updateDoc(userRef, {
              communitypoints: increment(1) // Assuming 1 point per event joined
          });

        // Add userUID to the joinedUsers array for the event
        try {
          const eventRef = doc(eventDatabase, "events", id);
          await updateDoc(eventRef, {
            joinedUsers: arrayUnion(userUID)
          });
          alert("You joined the event");
          window.location.reload()

        } catch (error) {
          console.error("Error joining event: ", error);
        }
      };

      const fetchUserNames = async (userUids) => {
        const userNames = [];
    
        for (const uid of userUids) {
          try {
            const userRef = doc(userDataDatabase, 'userDataDatabase', uid);
            const docSnap = await getDoc(userRef);
    
            if (docSnap.exists()) {
              const userData = docSnap.data();
              userNames.push(`${userData.firstname} ${userData.lastinitial}.`);
            } else {
              console.log(`No data found for user UID: ${uid}`);
            }
          } catch (error) {
            console.error(`Error fetching user data for UID: ${uid}`, error);
          }
        }
    
        return userNames;
      };

      const handleShowParticipants = async () => {
        const participantNames = await fetchUserNames(joinedUsers);
        if(joinedUsers.length == 0){
            alert("No Participants have signed up")
        }
        else{
            alert(`Participants: ${participantNames.join(', ')}`);
        }
        
      };

    return (
        <div className="event-card">
            <div className="event-header">
                <div className="event-tag">🏷️{tag}</div>
                <div className="event-location">
                    <div className="event-title">{title}</div>
                </div>
                <div className="event-joined">👥 People Joined {joinedUsers.length}/{maxJoined}</div>
            </div>
            <div className="event-description">{description}</div>
            <div className="event-date">📅{date}</div>
            <div className="event-location">📍{fullAddress}</div>

      <iframe
          width="600"
          height="450"
          style={{ border: "0" }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={googleMapsEmbedUrl}
        />
              <div className="event-author">🗣️{authorName}</div>
 <button className="event-join-button" onClick={handleJoinEvent}>JOIN</button>
 <button className="event-show-participants-button" onClick={handleShowParticipants}>Show Participants</button>
        </div>
    );
}

export default EventCard;