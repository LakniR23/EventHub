import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import ClubsAndSocieties from './pages/ClubsAndSocieties'
import Career from './pages/Career'
import CareerEventDetails from './pages/CareerEventDetails'
import ClubDetails from './pages/ClubDetails'
import Announcements from './pages/Announcements'
import Venues from './pages/Venues'
import VenueDetails from './pages/VenueDetails'
import About from './pages/About'
import Help from './pages/Help'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import UserList from './components/UserList.jsx'

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/clubs-and-societies" element={<ClubsAndSocieties />} />
          <Route path="/clubs/:id" element={<ClubDetails />} />
          <Route path="/career" element={<Career />} />
          <Route path="/career/:id" element={<CareerEventDetails />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
