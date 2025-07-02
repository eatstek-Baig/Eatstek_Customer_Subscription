import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../lib/services/apis";
import { AuthStorage } from "../lib/utils/AuthStorage";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const AdminLogin = () => {
        
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    // const { login } = useSGlobalContext();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        
        setLoading(true);
        e.preventDefault();
        
        try {
            const response = await ApiService.adminLogin(email, password);

            console.log(response);

            if (response.success) {
            
                AuthStorage.setToken(response?.token);
                navigate("/dashboard");
            } else {
                setError(response.data?.error || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setError(err?.message || "Invalid credentials. Please try again.");
        }finally{
            setLoading(false);
        }
    };

    return (
        <>
            <div className="h-screen m-0 p-0 bg-slate-100">
                <div className="h-full bg-cover bg-center bg-no-repeat">
                    <div className="flex items-center justify-center h-full">
                        <div className="md:w-96 sm:w-1/4 p-6 bg-white shadow-lg rounded-md">
                        <img src="/images/EatsTek_logo.png" alt="logo" className="w-36 mx-auto mb-4" />
                            <h1 className="text-2xl font-medium text-center mb-6">
                                Eatstek Subscription Management
                            </h1>
                            <h2 className="text-2xl font-semibold text-center mb-4">
                                Sign in
                            </h2>
                            <form onSubmit={handleLogin}>
                                <div className="mb-4 mt-4">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="name"
                                        id="email"
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
                                    <div className="relative w-full mt-1">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            id="password"
                                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                                            placeholder="Enter your password"
                                            value={password}
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

export default AdminLogin ;