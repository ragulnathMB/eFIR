import { Routes , Route,useLocation } from "react-router-dom";
import NavBar from "../components/AdminPortal/NavBar/NavBar";
import AdminHome from "../components/AdminPortal/Home/Home";
import AdminDashboard from "../components/AdminPortal/AdminDashboard/AdminDashboard";
import PublicQuery from "../components/AdminPortal/PublicQuery/PublicQuery";
import FirHistory from "../components/AdminPortal/FirHistory/FirHistory";
import AdminLogin from "../components/AdminPortal/AdminLogin/AdminLogin";
import ProtectedRoute from "../Middleware/ProtectedRoute";

const AdminRoutes=()=>{
    const location = useLocation();
    const navbarRoutes = ['/admin/home', '/admin/dashboard', '/admin/publicQueries', '/admin/firHistory'];
    return (
        <>
        {navbarRoutes.includes(location.pathname) && <ProtectedRoute role='JurisdictionAdmin'><NavBar /></ProtectedRoute>}
        <Routes>
            <Route path="/home" element={<ProtectedRoute role='JurisdictionAdmin'><AdminHome /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute role='JurisdictionAdmin'><AdminDashboard /></ProtectedRoute>}  />
            <Route path="/publicQueries" element={<ProtectedRoute role='JurisdictionAdmin'><PublicQuery /></ProtectedRoute>}  />
            <Route path="/firHistory" element={<ProtectedRoute role='JurisdictionAdmin'><FirHistory /></ProtectedRoute>}  />
            <Route path="/login" element={<AdminLogin />} />
        </Routes>
        </>
    );

}
export default AdminRoutes;