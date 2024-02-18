import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Fireserver from '../Fireserver';
const {userDatabase} = Fireserver;
import './Login.css';
import imag1 from "../Public/Photos/Central-Park.png"
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
    <div className="LoginPage">
       <img className="Central-Park" src={imag1} alt="Description of the image"></img>
      
       <div className="login-container">
            <h1 className="login-title">Login</h1>
      <form className="handleSignIn" onSubmit={handleSignIn}>
        <input className="text" type="text" name="email" placeholder="Email" />
        <input className="password" type="password" name="password" placeholder="Password" />
        <button className="Sign-in" type="submit"> Sign In</button>
      </form>
      <span>
      <button className="handleRegister" onClick={handleRegister}>Register</button>
        <button className="handleForgotPassword" onClick={handleForgotPassword}>Reset Password</button>
      </span>
    </div>
  </div>

  );
}

export default Login;
