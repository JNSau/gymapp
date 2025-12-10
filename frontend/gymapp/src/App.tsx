import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Exercises from "./pages/Exercises";
import ExerciseDetails from "./pages/ExerciseDetails";
import Plans from "./pages/Plans";
import PlanDetails from "./pages/PlanDetails";
import Home from "./pages/Home";
import Profile from "./pages/Profile"; // <--- 1. Import Profilu
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Ćwiczenia */}
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/:id" element={<ExerciseDetails />} />
          
          {/* Plany */}
          <Route path="/plans" element={<Plans />} />
          <Route path="/plans/:id" element={<PlanDetails />} />
          
          {/* Użytkownik */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* --- 2. DODANA TRASA PROFILU --- */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;