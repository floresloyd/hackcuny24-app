import { sendPasswordResetEmail } from "firebase/auth";
import userDatabase from "../Fireserver";
import './Forgot.css';
import CentralParkImage from "../Public/Photos/Central-Park1.png"; // Update the import path as necessary


function Forgot() {
  const handleReset = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Fix: Change from value() to value
    const email = e.target.email.value;

    sendPasswordResetEmail(userDatabase, email)
      .then(() => {
        alert("Password Reset Email Sent");
      })
      .catch((err) => {
        alert(err.message); // Display a more user-friendly error message
      });
  };

  return (
    <div className="Reset">
      <img className="Central-Park" src={CentralParkImage} alt="Central Park" />
      <div className="Reset-container"> {/* Make sure this matches the class in your CSS */}
        <h1 className="Reset-Password">Reset Password</h1>
        <form onSubmit={handleReset}>
          <input className="Email" type="email" name="email" placeholder="Email" />
          <button className="handle-reset" type="submit">Reset</button>
        </form>
      </div>
    </div>
  );
}

export default Forgot;
