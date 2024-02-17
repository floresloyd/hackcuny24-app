/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import Fireserver from '../Fireserver';
const { eventDatabase, userDataDatabase } = Fireserver;

function AddEventForm({ onEventAdded, onClose, author  }) {
  const [formData, setFormData] = useState({
    tag: '', title: '', description: '',
    date: '', address_line1: '', address_line2: '', city: '', zip: '', 
    max_joined: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(eventDatabase, 'events'), formData);
      console.log("Document written with ID: ", docRef.id);
      onEventAdded(); // Callback to notify that an event was added
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="tag" type="text" placeholder="Tag" onChange={handleChange} />
      <input name="title" type="text" placeholder="Title" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
      <input name="date" type="date" placeholder="Date" onChange={handleChange} />
      <input name="address_line1" type="text" placeholder="Address Line 1" onChange={handleChange} />
      <input name="address_line2" type="text" placeholder="Address Line 2" onChange={handleChange} />
      <input name="city" type="text" placeholder="City" onChange={handleChange} />
      <input name="zip" type="text" placeholder="ZIP Code" onChange={handleChange} />
      <input name="max_joined" type="number" placeholder="Max Joined" onChange={handleChange} />
      <button type="submit">Submit</button>
      <button type="button" onClick={onClose}>Close</button> {/* Close Button */}
    </form>
  );
}

export default AddEventForm;
