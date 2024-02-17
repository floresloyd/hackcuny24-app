import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Fireserver from '../Fireserver';
import EventCard from '../components/EventCard';
const {eventDatabase} = Fireserver;

function Events() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null); // State to keep track of the user's auth status
  const auth = getAuth()
  const history = useNavigate();

    // Check user authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser); // currentUser will be null if not logged in
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);


  // Loads Event data from the database
  useEffect(() => {
    const eventcolRef = collection(eventDatabase, 'events');

    getDocs(eventcolRef).then(snapshot => {
      const eventsArray = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setEvents(eventsArray);
      console.log(events)
    }).catch(err => {
      console.log(err.message);
    });
  }, []);



  const handleAddEvent = () => {
    // Redirect to login if user is not signed in
    if (!user) {
      // You can use navigate from useNavigate hook to redirect
      // navigate('/login');
      alert('User not logged in. Redirect to login page.');
      history('/login')
      // Alternatively, you could display a message or open a login modal here
      return;
    }
    
    console.log('Add Event');
    // Implement the logic to add an event

  };

  return (
    <div>
      <h1>Events</h1>
      <button onClick={handleAddEvent}> Add event</button>

      <div>
        {events.map(event => (
          <EventCard
            key={event.id}
            tag={event.tag}
            title={event.title}
            description={event.description}
            author={event.author}
            date={event.date}
            addressLine1={event.address_line1}
            addressLine2={event.address_line2}
            city={event.city}
            zip={event.zip}
            joined={event.joined}
            maxJoined={event.max_joined}
          />
        ))}
      </div>

    </div>
  );
}

export default Events;
