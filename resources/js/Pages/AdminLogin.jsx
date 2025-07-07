import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { AuthService } from "../lib/services/auth/AuthService";
import { toast } from "react-toastify";
import { usesAuthContext } from "../lib/contexts/AuthContext";

const AdminLogin = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = usesAuthContext();

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await AuthService.login(email, password);

            if (response.data.success) {
                login(response.data);
                navigate("/");

            } else {
                console.log(response)
                toast.error(
                        "Invalid Credentials. Please try again."
                );
            }
        } catch (err) {
            toast.error("Login failed. Please try again.");
            // setError(err?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="h-screen m-0 p-0 bg-slate-100">
                <div className="h-full bg-cover bg-center bg-no-repeat">
                    <div className="flex items-center justify-center h-full">
                        <div className="md:w-96 sm:w-1/4 p-6 bg-white shadow-lg rounded-md">
                            <img
                                src="/images/EatsTek_logo.png"
                                alt="logo"
                                className="w-36 mx-auto mb-4"
                            />
                            <h1 className="text-2xl font-medium text-center mb-6">
                                Eatstek Subscription Management
                            </h1>
                            <h2 className="text-2xl font-semibold text-center mb-4">
                                Sign in
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 mt-4">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="mb-4 mt-4">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <div className="relative w-full mt-1 password-wrapper">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                                            placeholder="Enter your password"
                                            value={password}
                                            id="password"
                                            required
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                        >
                                            {showPassword ? (
                                                <EyeIcon />
                                            ) : (
                                                <EyeOffIcon />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-4 mt-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
                                        />
                                        <label
                                            htmlFor="remember"
                                            className="ml-2 text-sm text-gray-600"
                                        >
                                            Remember Me
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 text-white text-md rounded-md bg-red-500"
                                >
                                    Login
                                </button>
                                {error && (
                                    <p style={{ color: "red" }}>{error}</p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;
