import './App.css';
import { Routes, Route} from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import { AccessibilityProvider } from './components/UserAccessibility/AccessibilityContext';
import UserAccessibility from './components/UserAccessibility/UserAccessibility';
import AdminLogin from './components/AdminPortal/AdminLogin/AdminLogin';
import { AuthProvider } from './components/AuthProvider/AuthProvider';
import AdminRoutes from './Routes/AdminOfficerRoutes';
import OfficerRoutes from './Routes/PoliceOfficerRoutes';
import UserRoutes from './Routes/PublicUserRoutes';

function App() {

  return (
    <AccessibilityProvider>
      <div className="main">
        <UserAccessibility />
        <AuthProvider> {/* Wrap your app with AuthProvider to provide user data globally */}
          <Routes>
            <Route path="/*" element={<UserRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/officer/*" element={<OfficerRoutes />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/login" element={<Login />} />
            {/* You can add other routes as needed */}
          </Routes>
    </AuthProvider>
        <Footer />
      </div>
    </AccessibilityProvider>
  );
}

export default App;