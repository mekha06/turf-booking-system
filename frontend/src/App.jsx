import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TurfDetails from "./pages/TurfDetails";
import Recommendations from "./pages/Recommendations";
import MyBookings from "./pages/MyBookings";
import OwnerDashboard from "./pages/OwnerDashboard";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/turfs/:id" element={<TurfDetails />} />

        {/* Protected User Routes */}
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* Protected Owner Route */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;