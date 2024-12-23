import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/protected",{withCredentials:true});
        const user = response.data;

        if (!user) {
          navigate("/admin/login");
        } else if (role !== user.role) {
          return <div>Unauthorized!</div>;
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        navigate("/admin/login");
      }
    };

    checkUser();
  }, [navigate]);

  return children;
};

export default ProtectedRoute;
