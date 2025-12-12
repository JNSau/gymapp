import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Exercises from "./pages/Exercises";
import ExerciseDetails from "./pages/ExerciseDetails";
import Plans from "./pages/Plans";
import PlanDetails from "./pages/PlanDetails";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ActiveWorkout from "./pages/ActiveWorkout"; // <--- 1. IMPORT
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Exercises */}
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/:id" element={<ExerciseDetails />} />
          
          {/* Plans */}
          <Route path="/plans" element={<Plans />} />
          <Route path="/plans/:id" element={<PlanDetails />} />
          
          {/* Active Workout (Trening na żywo) */}
          {/* --- 2. NOWA TRASA --- */}
          <Route path="/workout/:planId/:dayId" element={<ActiveWorkout />} />
          
          {/* User Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;