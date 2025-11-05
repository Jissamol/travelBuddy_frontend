import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import PersonalizePlan from './components/PersonalizePlan';
import ItineraryPage from './components/ItineraryPage';
import AddItineraryPage from './components/AddItineraryPage';
import TopItineraries from './components/TopItineraries';
import AllItinerariesPage from './components/AllItinerariesPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/personalize-plan" element={<PersonalizePlan />} />
            <Route path="/plans/:planId/itineraries" element={<ItineraryPage />} />
            <Route path="/plans/:planId/itineraries/add" element={<AddItineraryPage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/top-itineraries" element={<TopItineraries />} />
            <Route path="/all-itineraries" element={<AllItinerariesPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
