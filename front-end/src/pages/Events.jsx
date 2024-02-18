// Events.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import Fireserver from "../Fireserver";
import EventCard from "../components/EventCard";
import AddEventForm from "../components/AddEventForm";
import './Events.css'; // Make sure the CSS file is linked

const { eventDatabase, userDataDatabase } = Fireserver;

function Events() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const [currentAuthor, setAuthor] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(userDataDatabase, "userDataDatabase", currentUser.uid);
        getDoc(userDocRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              const firstname = docSnap.data().firstname;
              const lastinitial = docSnap.data().lastinitial;
              const fullName = firstname + " " + lastinitial + ".";
              setAuthor(fullName);
            } else {
              console.log("No user data available");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const eventcolRef = collection(eventDatabase, "events");
    getDocs(eventcolRef)
      .then((snapshot) => {
        const eventsArray = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setEvents(eventsArray);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showSortDropdown && !event.target.closest('.sortButtonContainer')) {
        setShowSortDropdown(false);
      }
    }

    if (showSortDropdown) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [showSortDropdown]);

  const handleAddEvent = () => {
    if (!user) {
      alert("User not logged in. Redirecting to login page.");
      navigate("/login");
      return;
    }
    setShowAddForm(true);
  };

  const onEventAdded = () => {
    setShowAddForm(false);
  };

  const handleClose = () => setShowAddForm(false);

  const handleDateSort = () => {
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
    setEvents(sortedEvents);
  };

  const handleSortAvailability = () => {
    const sortedEvents = [...events].sort((a, b) => {
      const availabilityA = a.max_joined - a.joinedUsers.length;
      const availabilityB = b.max_joined - b.joinedUsers.length;
      return availabilityB - availabilityA; // Sort by descending availability
    });
    setEvents(sortedEvents);
  };

  const handleSortTag = () => {
    const sortedEvents = [...events].sort((a, b) => {
      const tagA = a.tag.toUpperCase(); // ignore upper and lowercase
      const tagB = b.tag.toUpperCase(); // ignore upper and lowercase
      if (tagA < tagB) {
        return -1;
      }
      if (tagA > tagB) {
        return 1;
      }
      return 0;
    });
    setEvents(sortedEvents);
  };

  const toggleSortDropdown = (event) => {
    event.stopPropagation(); // Prevents the click event from reaching the window listener immediately
    setShowSortDropdown(!showSortDropdown);
    console.log("Toggling sort dropdown. Current state:", !showSortDropdown); // For debugging
  };

  return (
    <div className="events-container"> {/* This wrapper ensures content starts below the Navbar */}

      <button onClick={handleAddEvent} className="addEventButton">Add event</button>
      <div className="sortButtonWrapper">
      <button onClick={toggleSortDropdown} className="sortButton">Sort</button>
      {showSortDropdown && (
        <div className="dropdown">
          <div onClick={handleDateSort} className="dropdown-item">Sort: Date</div>
          <div onClick={handleSortAvailability} className="dropdown-item">Sort: Availability</div>
          <div onClick={handleSortTag} className="dropdown-item">Sort: Tag</div>
        </div>
      )}
    </div>
        {showAddForm && currentAuthor && (
 <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
  <div onClick={(e) => e.stopPropagation()}> {/* Prevents click inside the form from closing it */}
    <AddEventForm
        onEventAdded={onEventAdded}
        onClose={() => { setShowAddForm(false); }}
        author={currentAuthor}
        uid={user?.uid}
    />
  </div>
</div>
)}
        <div>
            {events.map((event) => (
                <EventCard
                    key={event.id}
                    {...event}
                    joinedUsers={event.joinedUsers || []}
                    maxJoined={event.max_joined}
                    userUID={user?.uid}
                    authorUID={auth.uid}
                />
            ))}
        </div>
    </div>
);
}

export default Events;
