import { Routes , Route,useLocation } from "react-router-dom";
import Home from "../components/Home/Home";
import ProtectedRoute from "../Middleware/ProtectedRoute";
import UserDashboardPage from "../components/Dashboard/UserDashboardPage";
import FIRFilingPage from "../components/FIRFilingPage/FIRFilingPage";
import ContactUs from "../components/ContactUs/ContactUs";
import SignUp from "../components/Signup/Signup";
import Login from "../components/Login/Login";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
import NavBar from "../components/NavBar/NavBar";
import ProtectedRoute2 from "../Middleware/ProtectedRoute2";
import FAQs from "../components/faq/faq";




const UserRoutes=()=>{
    const location = useLocation();
    const navbarRoutes = ['/','/FileFIR','/contact','/FAQs','/UserDashboard'];
    return (
        <>
        {navbarRoutes.includes(location.pathname) &&<NavBar />}
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/UserDashboard" element={<ProtectedRoute2 role='user'><UserDashboardPage /></ProtectedRoute2>} />
            <Route path="/FileFIR" element={<ProtectedRoute2 role='user'><FIRFilingPage /></ProtectedRoute2>} />
            <Route path="/contact" element={<ContactUs/>} />
            <Route path="/FAQs" element={<FAQs/>} />
            <Route path="/register" element={<SignUp/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/forgotPass" element={<ForgotPassword/>}/>
        </Routes>
        </>
    );

}
export default UserRoutes;