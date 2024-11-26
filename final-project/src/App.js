import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/navigationBar";
import FlightBooking from "./Components/flightBooking";
import Login from "./Components/logIn";
import Signup from "./Components/signUp";
import ManageFlights from "./Components/manageFlights";
import ExplorePage from "./Components/explorePage";
import AdminDashboard from "./Admin Components/adminDashboard";
import AdminNavBar from "./Admin Components/adminNavigationBar";
import AvailableFlights from "./Components/displayFlights";
import { AuthProvider } from './Components/authContext';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {/* Only show Navbar for user routes */}
      {location.pathname !== "/admin-dashboard" && <Navbar />}

      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/flight-booking" element={<FlightBooking />} />
        <Route path="/available-flights" element={<AvailableFlights />} />
        <Route path="/log-in" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/manage-flights" element={<ManageFlights />} />
        
        {/* Admin route with AdminNavBar */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminNavBar>
              <AdminDashboard />
            </AdminNavBar>
          }
        />
      </Routes>
    </div>
  );
}

export default function Wrapper() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}
