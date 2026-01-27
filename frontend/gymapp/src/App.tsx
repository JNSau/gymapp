import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";


import Exercises from "./pages/Exercises";
import ExerciseDetails from "./pages/ExerciseDetails";
import Plans from "./pages/Plans";
import PlanDetails from "./pages/PlanDetails";
import Profile from "./pages/Profile";
import ActiveWorkout from "./pages/ActiveWorkout";
import Survey from "./pages/Survey";
import MyWorkouts from "./pages/MyWorkouts"; // <--- 1. IMPORT MOICH TRENINGÓW


import ProtectedRoute from "./components/ProtectedRoute"; 
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      
      <AuthProvider>
        <Navbar />
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          
          
          <Route path="/survey" element={
            <ProtectedRoute>
              <Survey />
            </ProtectedRoute>
          } />

          
          <Route path="/my-workouts" element={
            <ProtectedRoute>
              <MyWorkouts />
            </ProtectedRoute>
          } />

          <Route path="/exercises" element={
            <ProtectedRoute>
              <Exercises />
            </ProtectedRoute>
          } />
          
          <Route path="/exercises/:id" element={
            <ProtectedRoute>
              <ExerciseDetails />
            </ProtectedRoute>
          } />

          <Route path="/plans" element={
            <ProtectedRoute>
              <Plans />
            </ProtectedRoute>
          } />
          
          <Route path="/plans/:id" element={
            <ProtectedRoute>
              <PlanDetails />
            </ProtectedRoute>
          } />

          <Route path="/workout/:planId/:dayId" element={
            <ProtectedRoute>
              <ActiveWorkout />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;