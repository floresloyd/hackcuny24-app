import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Fireserver from '../Fireserver';
const { userDatabase, userDataDatabase } = Fireserver;
import Manhattan from "../Public/Photos/Manhattan.png"; 
import "./Register.css";

function Login() {
  const history = useNavigate(); // Routes

  const handleSignUp = (e) => {
    e.preventDefault(); // Prevents browser refresh
    const email = e.target.email.value;
    const password = e.target.password.value;
    const firstname = e.target.firstname.value;
    const lastinitial = e.target.lastinitial.value;

    createUserWithEmailAndPassword(userDatabase, email, password)
      .then((userCredential) => {
        // User successfully created, now create an entry in Firestore
        const uid = userCredential.user.uid; // Get the UID of the created user
        const userDocRef = doc(userDataDatabase, 'userDataDatabase', uid);

        return setDoc(userDocRef, {
          firstname,
          lastinitial,
          uid
        });
      })
      .then(() => {
        console.log("User data saved to Firestore");
        history("/"); // Navigate to home page after successful signup and Firestore entry
      })
      .catch((err) => {
        console.error("Error signing up", err);
        alert(err.message);
      });
  };

  return (
    <div className="Register">
      <img className="Manhattan" src={Manhattan} alt="Manhattan" />
      <div className="Register-Form"> {/* Updated class name for styling */}
        <h1 className="Register-Text"> Register </h1>
        <form onSubmit={handleSignUp}>
          <input className="Email-container" type="text" name="email" placeholder="Email" required />
          <input className="Password-container" type="password" name="password" placeholder="Password" required />
          <input className="Fname-container" type='text' name='firstname' placeholder="First Name" required />
          <input className="Lname-container" type='text' name='lastinitial' placeholder="Last Initial" required />
          <button className="Signup-container" type="submit">SignUp</button>
        </form>
      </div>
    </div>
  )
}

export default Login;
