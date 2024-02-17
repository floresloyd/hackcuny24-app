import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Fireserver from '../Fireserver';
import EventCard from '../components/EventCard';
import AddEventForm from '../components/AddEventForm';

const { eventDatabase, userDataDatabase } = Fireserver;


function Events() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Do something when the user is logged in
        // Currently, this is just setting the user state
      } else {
        // Handle user not logged in
      }
    });
  
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const eventcolRef = collection(eventDatabase, 'events');

    getDocs(eventcolRef).then(snapshot => {
      const eventsArray = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setEvents(eventsArray);
    }).catch(err => {
      console.error(err.message);
    });
  }, []);

  const handleAddEvent = () => {
    if (!user) {
      alert('User not logged in. Redirecting to login page.');
      navigate('/login');
      return;
    }
    setShowAddForm(true);
  };

  const onEventAdded = () => {
    setShowAddForm(false);
    // TODO: Refresh your events list here if needed
  };

  const handleClose = () => setShowAddForm(false);

  return (
    <div>
      <h1>Events</h1>
      <button onClick={handleAddEvent}> Add event</button>
      {showAddForm && <AddEventForm onEventAdded={onEventAdded} onClose={handleClose} />}

      <div>
        {events.map(event => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}

export default Events;
