import { sendPasswordResetEmail } from "firebase/auth";
import userDatabase from "../Fireserver";

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
    <div>
      <h1> Forgot Password?</h1>
      <form onSubmit={handleReset}>
        <input type="email" name="email" placeholder="Email" />
        <button type="submit">Reset</button>
      </form>
    </div>
  );
}

export default Forgot;
