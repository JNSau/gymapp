import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Exercises from "./pages/Exercises";
import Plans from "./pages/Plans";
import PlanDetails from "./pages/PlanDetails";
import { AuthProvider } from "./context/AuthContext"; // <--- Musisz to zaimportować
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider musi otaczać wszystko, co korzysta z logowania */}
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Exercises />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/plans/:id" element={<PlanDetails />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;