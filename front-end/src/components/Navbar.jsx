import React from 'react';
import './Nabar.css'; // Correct the file name if necessary
import { signOut } from "firebase/auth";
import userDatabase from "../Fireserver";

function Navbar() {
    const handleSignOut = () => {
        signOut(userDatabase).then((val) => {
            console.log(val, "val");
        });
    };

    return (
        <nav className="navbar">
            <div> {/* Container for grouped items */}
                <a href="/" className="nav-link">Home</a>
                <a href="/events" className="nav-link">Events</a>
            </div>
            <button onClick={handleSignOut} className="nav-link sign-out">Sign Out</button>
        </nav>
    );
}

export default Navbar;
