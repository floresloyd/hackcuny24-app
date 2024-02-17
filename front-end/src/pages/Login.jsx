import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Fireserver from '../Fireserver';
const {userDatabase} = Fireserver;


function Login() {
  const history = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault(); // Prevent page from reloading automatically when form is submitted 

    // Access form variablesw
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Firebase function to login
    signInWithEmailAndPassword(userDatabase, email, password)
      .then(() => {
        history("/"); // Navigate to '/home' upon successful login
      })
      .catch((err) => {
        alert(err.message); // Show error message
      });
  };

  const handleForgotPassword = () => {
    history("/forgot");
  };

  const handleRegister = () => {
    history("/register");
  };

  return (
    <div>
      <h1> Login </h1>
      <form onSubmit={handleSignIn}>
        <input type="text" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit"> Sign In</button>
      </form>
      <span>
      <button onClick={handleRegister}>Register</button>
        <button onClick={handleForgotPassword}>Forgot Password</button>
      </span>
    </div>
  );
}

export default Login;
