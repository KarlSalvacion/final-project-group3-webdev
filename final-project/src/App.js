import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/navigationBar';
import FlightBooking from './Components/flightBooking';
import Login from './Components/logIn';
import Signup from './Components/signUp';
import AdminDashboard from './Components/adminDashboard';
import ManageFlights from './Components/manageFlights';
import ExplorePage from './Components/explorePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar>
          <Routes>
            <Route path="/" element={<ExplorePage/>}/>
            <Route path="/explore" element={<ExplorePage/>} />
            <Route path="/flight-booking" element={<FlightBooking/>}/>
            <Route path="/log-in" element={<Login/>}/>
            <Route path="/sign-up" element={<Signup/>}/>
            <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
            <Route path="/manage-flights" element={<ManageFlights/>}/>
          </Routes>
        </Navbar>
      </div>
    </Router>

    
  );
}

export default App;
