import { Routes , Route,useLocation } from "react-router-dom";
import ProtectedRoute from "../Middleware/ProtectedRoute";
import AdminLogin from "../components/AdminPortal/AdminLogin/AdminLogin";
import NavBar from "../components/OfficerPortal/NavBar/NavBar";
import OfficerHome from "../components/OfficerPortal/Home/Home";
import OfficerDashboard from "../components/OfficerPortal/OfficerDashboard/OfficerDashboard";
import PublicQuery from "../components/AdminPortal/PublicQuery/PublicQuery";


const OfficerRoutes=()=>{
    const location = useLocation();
    const navbarRoutes = ['/officer/home', '/officer/dashboard', '/officer/publicQueries'];
    return (
        <>
        {navbarRoutes.includes(location.pathname) && <ProtectedRoute role='Officer'><NavBar /></ProtectedRoute>}
        <Routes>
            <Route path="/home" element={<ProtectedRoute role='Officer'><OfficerHome /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute role='Officer'><OfficerDashboard /></ProtectedRoute>}  />
            <Route path="/publicQueries" element={<ProtectedRoute role='Officer'><PublicQuery /></ProtectedRoute>}  />
            <Route path="/login" element={<AdminLogin />} />
        </Routes>
        </>
    );

}
export default OfficerRoutes;