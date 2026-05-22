import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function LogoutUser({ setIsAuth }) {

    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Error occured on logout form", error);
            alert("Failed to logout");
        } finally {
            localStorage.removeItem("isAuth");
            setIsAuth(false);

            navigate("/");
        }
    }

    return (
        <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold hover:bg-red-100 transition"
        >
            Logout
        </button>
    );
}