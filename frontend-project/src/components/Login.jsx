import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function LoginForm({ setIsAuth }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/auth/login", { username, password });

            localStorage.setItem("isAuth", "true");
            setIsAuth(true);

            navigate("/dashboard");
        } catch (error) {
            console.error("Error occured on login form", error);
            alert(error.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-8 bg-teal-500 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            Login
                        </h2>
                    </div>

                    <p className="text-sm text-slate-500">
                        Sign in to continue to your dashboard
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter Username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-100 hover:bg-slate-200 transition rounded-xl py-3 font-semibold text-green-600 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-sm text-center text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-green-600 hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}