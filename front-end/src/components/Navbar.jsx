import './Nabar.css'; // Correct the file name if necessary
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Fireserver from '../Fireserver';

const { userDatabase } = Fireserver;

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(userDatabase, (currentUser) => {
            setUser(currentUser);
        });

        // Cleanup the listener on unmount
        return unsubscribe;
    }, []);

    const handleSignOut = () => {
        signOut(userDatabase).then(() => {
            console.log("User signed out");
            navigate('/login'); // Redirect to login after sign out
        }).catch((error) => {
            // Handle errors here
            console.error("Sign out error", error);
        });
    };

    return (
        <nav className="navbar">
            <div> {/* Container for grouped items */}
                <a href="/" className="nav-link">Home</a>
                <a href="/events" className="nav-link">Events</a>
                <a href="/leaderboard" className="nav-link">Leaderboard</a>
            </div>
            {user ? (
                <button onClick={handleSignOut} className="nav-link sign-out">Sign Out</button>
            ) : (
                <a href="/login" className="nav-link sign-out">Login</a>
            )}
        </nav>
    );
}

export default Navbar;
