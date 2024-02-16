import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Forgot from "./pages/Forgot";

function App() {
  return (
    <div>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />

          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
