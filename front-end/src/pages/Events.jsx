/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import Fireserver from "../Fireserver";
import EventCard from "../components/EventCard";
import AddEventForm from "../components/AddEventForm";

const { eventDatabase, userDataDatabase } = Fireserver;

function Events() {
  const [events, setEvents] = useState([]); // Available Windows
  const [user, setUser] = useState(null); // Current user
  const [showAddForm, setShowAddForm] = useState(false); // State that manages drop down of add job
  const auth = getAuth(); // Current user base object
  const navigate = useNavigate(); // Allows us to reroute
  const [currentAuthor, setAuthor] = useState(""); // Current author of event

  // ACESS USER NAME USING UID / userid
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // User is logged in
        const userDocRef = doc(
          userDataDatabase,
          "userDataDatabase",
          currentUser.uid
        );
        getDoc(userDocRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              const firstname = docSnap.data().firstname;
              const lastinitial = docSnap.data().lastinitial;
              const fullName = firstname + " " + lastinitial + ".";
              setAuthor(fullName); // This will schedule an update to 'currentAuthor'
            } else {
              console.log("No user data available");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      } else {
        // Handle user not logged in
      }
    });
    return () => unsubscribe();
  }, [auth]); // Only re-run the effect if 'auth' changes

  // Pulls all events
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
    // This effect runs when 'currentAuthor' changes
    console.log("Current Author:", currentAuthor);
  }, [currentAuthor]); // Only re-run the effect if 'currentAuthor' changes

  const handleAddEvent = () => {
    if (!user) {
      alert("User not logged in. Redirecting to login page.");
      navigate("/login");
      return;
    }
    setShowAddForm(true);
  };

  {
    /** ADD EVENT BUTTON OPEN/CLOSE FORM */
  }
  const onEventAdded = () => {
    setShowAddForm(false);
    // TODO: Refresh your events list here if needed
  };

  const handleClose = () => setShowAddForm(false);

  {
    /** SORTING BUTTON FUNCTIONALITY  */
  }
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

  return (
    <div>
      <h1>Events</h1>
      <button onClick={handleAddEvent}> Add event</button>
      <button onClick={handleDateSort}> Sort: Date</button>
      <button onClick={handleSortAvailability}> Sort: Availability</button>
      <button onClick={handleSortTag}> Sort: Tag</button>
      {showAddForm &&
        currentAuthor && ( // Only render AddEventForm if currentAuthor is set
          <AddEventForm
            onEventAdded={onEventAdded}
            onClose={handleClose}
            author={currentAuthor} // Pass the author name
            uid={user?.uid}
          />
        )}
      <div>
        {events.map((event) => (
          <EventCard
            key={event.id}
            {...event}
            joinedUsers={event.joinedUsers || []} // Pass joinedUsers, defaulting to an empty array if not present
            maxJoined={event.max_joined} // Pass max_joined
            userUID={user?.uid} // Pass the current user's UID
            authorUID={auth.uid}
          />
        ))}
      </div>
    </div>
  );
}

export default Events;
