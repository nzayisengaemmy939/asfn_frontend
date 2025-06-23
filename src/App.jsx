import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './authentication/pages/SignIn';
import Signup from './authentication/pages/Signup';
import FarmerDashboard from './dashboard/FarmerDashboard';
import VeterinarianDashboard from './dashboard/VeterinarianDashboard';
import AuthorityDashboard from './dashboard/AuthorityDashboard';
import ProfilePage from './authentication/components/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<SignIn />} />

        {/* Sign up page */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/veteri-dashboard" element={<VeterinarianDashboard />} />
        <Route path="/authority-dashboard" element={<AuthorityDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
