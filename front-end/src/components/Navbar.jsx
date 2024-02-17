import { signOut } from "firebase/auth";
import userDatabase from "../Fireserver";

function Navbar() {

    const handleSignOut = () => {
      signOut(userDatabase).then((val) => {
        console.log(val, "val");
      });

    };
  return (
    <div>
      <a href="/login"> Login </a>
      <a href="/register"> Register </a>
      <a href="/"> Home </a>
      <a href="/events">Events</a>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default Navbar;
