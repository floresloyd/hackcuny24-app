import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Fireserver from '../Fireserver';

const { userDatabase, userDataDatabase } = Fireserver;

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
    <div>
      <h1> Register </h1>
      <form onSubmit={handleSignUp}>
        <input type="text" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <input type='text' name='firstname' placeholder="First Name" required />
        <input type='text' name='lastinitial' placeholder="Last Initial" required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Login;
