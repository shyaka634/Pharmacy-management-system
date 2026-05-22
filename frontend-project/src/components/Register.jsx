import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/auth/register", { username, password });

            alert("Registered user successfully");

            navigate("/login");
        } catch (error) {
            console.error("Error occured when registering user", error);
            alert("Failed to Register User");
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
                            Register
                        </h2>
                    </div>

                    <p className="text-sm text-slate-500">
                        Create your account to get started
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-5">

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
                        {loading ? "Registering..." : "Register"}
                    </button>

                    <p className="text-sm text-center text-slate-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-green-600 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}