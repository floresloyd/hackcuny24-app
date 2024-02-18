/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState } from 'react';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import Fireserver from '../Fireserver';
import './AddEventForm.css';
const { eventDatabase, userDataDatabase } = Fireserver;

function AddEventForm({ onEventAdded, onClose, author, uid }) {
  const [formData, setFormData] = useState({
    tag: '', title: '', description: '',
    date: '', address_line1: '', address_line2: '', city: '', zip: '', 
    max_joined: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("UID AT SUB", uid)
    try {
      const eventWithAuthor = {
        ...formData,
        authorUID: uid, // Set authorUID here using the uid prop
        authorName: author, // Ensure the author prop is defined
        joinedUsers: [] // Initialize joinedUsers as an empty array
      };
      const docRef = await addDoc(collection(eventDatabase, 'events'), eventWithAuthor);
      console.log("Document written with ID: ", docRef.id);
      alert("Event Created!")
      window.location.reload()
  
      // Update community points for the user
      const userRef = doc(userDataDatabase, 'userDataDatabase', uid);
      await updateDoc(userRef, {
        communitypoints: increment(2) // Increment the community points by 2
      });
  
      onEventAdded(); // Callback to notify that an event was added
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} >
      <input className='Tag' name="tag" type="text" placeholder="Tag" onChange={handleChange} />
      <input className='Title' name="title" type="text" placeholder="Title" onChange={handleChange} />
      <textarea className='description' name="description" placeholder="Description" onChange={handleChange}></textarea>
      <input className='Date' name="date" type="date" placeholder="Date" onChange={handleChange} />
      <input className='Address_line1' name="address_line1" type="text" placeholder="Address Line 1" onChange={handleChange} />
      <input className='Address_line2' name="address_line2" type="text" placeholder="Address Line 2" onChange={handleChange} />
      <input className='City'  name="city" type="text" placeholder="City" onChange={handleChange} />
      <input className='Zip' name="zip" type="text" placeholder="ZIP Code" onChange={handleChange} />
      <input className='Max_joined' name="max_joined" type="number" placeholder="Max Joined" onChange={handleChange} />
      <button className='Submit' type="submit">Submit</button>
      <button className='Close' type="button" onClick={onClose}>Close</button> {/* Close Button */}
    </form>
  );
}

export default AddEventForm;
