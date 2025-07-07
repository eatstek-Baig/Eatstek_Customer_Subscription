import React, { useState, useEffect, useRef } from "react";
import { AuthService } from "../lib/services/auth/AuthService";
import { replace, useNavigate } from "react-router-dom";
import { usesAuthContext } from "../lib/contexts/AuthContext";
import { toast } from "react-toastify";

const Header = () => {

    const {logout} = usesAuthContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const dropDownRef = useRef(null);

    const navigate = useNavigate();

    //show logout popup
    const handleLogout = (e) => {
        e.stopPropagation(); // Prevent event propagation
        setIsLogoutConfirmOpen(true);
    };

    const confirmLogout = async () => {
        try {
            const response = await AuthService.logout();
            if (response.data.success) {
                logout();
                setIsLogoutConfirmOpen(false);
                setIsDropdownOpen(false);
            } else {
                toast.error( response.data.error || "Logout Failed");
            }
           
        } catch (error) {
            toast.error("failed to logout", error);
        }
    };

    const cancelLogout = () => {
        setIsLogoutConfirmOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleProfileClick = (e) => {
        e.stopPropagation(); // Prevent event propagation
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropDownRef.current &&
                !dropDownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropDownRef, isDropdownOpen]);

    return (
        <header className="flex justify-end px-6 py-5 bg-white shadow-md">
            <div className="flex items-center relative">
                {/* Profile Icon */}
                <div
                    className=" w-10 h-10 bg-gray-800 text-white flex items-center justify-center rounded-full cursor-pointer"
                    onClick={toggleDropdown}
                >
                    {JSON.parse(localStorage.getItem("user"))
                        ?.user.name?.charAt(0)
                        .toUpperCase()}
                </div>

                {/* Dropdown */}
                {isDropdownOpen && (
                    <div
                        ref={dropDownRef}
                        style={{
                            position: "absolute",
                            right: "-15px",
                            top: "100%",
                        }}
                        className="py-2 w-40 bg-white rounded-md shadow-lg z-50"
                    >
                        <div
                            onClick={handleProfileClick}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                            Profile
                        </div>
                        <div
                            onClick={handleLogout}
                            className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                        >
                            Logout
                        </div>
                    </div>
                )}
            </div>

            {/* Logout Confirmation Modal */}
            {isLogoutConfirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50 z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg">
                        <h2 className="text-lg font-bold mb-4">
                            Are you sure you want to logout?
                        </h2>
                        <div className="flex justify-center">
                            <button
                                onClick={confirmLogout}
                                className="h-8 px-4 mr-3 text-white bg-yellow-400 rounded hover:bg-red-600"
                            >
                                Yes
                            </button>
                            <button
                                onClick={cancelLogout}
                                className="px-4 h-8 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
