import './Navbar.css';
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Use the Link component for navigation without page reload

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth(); // You should use the auth instance from the firebase/auth

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return unsubscribe; // Cleanup the listener on unmount
    }, [auth]); // Depend on the auth object

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out");
            navigate('/login'); // Redirect to login after sign out
        } catch (error) {
            console.error("Sign out error", error);
        }
    };

    return (
    <div className="main-content">
       <nav className="navbar">
            <div> {/* Container for grouped items */}
                <a href="/" className="nav-link">Home</a>
                <a href="/events" className="nav-link">Events</a>
                <a href="/leaderboard" className="nav-link">Leaderboard</a>
                <a href="/analysis" className="nav-link">Analysis</a>
            </div>
            {user ? (
                    <button onClick={handleSignOut} className="nav-link sign-out">Sign Out</button>
                ) : (
                    <Link to="/login" className="nav-link sign-in">Login</Link>
                )}
        </nav>
    </div>
    );
}

export default Navbar;
