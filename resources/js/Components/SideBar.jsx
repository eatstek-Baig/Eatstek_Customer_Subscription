import {
    FaHome,
    FaClipboardList,
    FaRegUserCircle,
    FaDesktop,
    FaUtensils,
    FaRev,
    FaBusinessTime,
    FaLink,
    FaClipboard,
    FaChartLine,
    FaCheck,
    FaBan,
    FaUserPlus,
    FaSync,
    FaUsers,
    FaCheckCircle,
} from "react-icons/fa";
import { FaBoxOpen, FaReceipt, FaTruck, FaChartBar } from "react-icons/fa";
import {
    VscChevronLeft,
    VscChevronRight,
    VscChevronDown,
} from "react-icons/vsc";
import { useState } from "react";

const Sidebar = ({ onNavClick }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false); // State to manage Orders dropdown
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                className={`relative top-4 left- z-50 p-2 ${
                    isOpen ? "right-4" : "left-6"
                }text-black rounded-md focus:outline-none flex items-center gap-2`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-xl font-bold">
                    {" "}
                    {isOpen ? "Admin Panel" : ""}{" "}
                </span>
                {isOpen ? <VscChevronLeft /> : <VscChevronRight />}
            </button>

            {/* Sidebar */}
            <div
                className={`bg-gray-50 text-black h-screen p-5 mt-4 transition-all duration-300 ${
                    isOpen ? "w-64" : "w-16"
                }`}
            >
                <ul className="space-y-4">
                    {/* registration tab */}
                    <li>
                        <button
                            onClick={() => onNavClick("register")}
                            className="flex items-center space-x-2 hover:text-red-500 hover:cursor-pointer"
                        >
                            <FaUserPlus /> {isOpen && <span> Register Client </span>}
                        </button>
                    </li>
                    {/* Renew Subscription tab */}
                    <li>
                        <button
                            onClick={() => onNavClick("renewSubscription")}
                            className="flex items-center space-x-2 hover:text-red-500 hover:cursor-pointer"
                        >
                            <FaSync />{" "}
                            {isOpen && <span> Renew Subscription </span>}
                        </button>
                    </li>

                    {/* List all subscriptions */}
                    <li>
                        <button
                            onClick={() => onNavClick("subscribedUsers")}
                            className="flex items-center space-x-2 hover:text-red-500 w-full hover:cursor-pointer"
                        >
                            <FaUsers />{" "}
                            {isOpen && <span> Subscibed Users </span>}
                        </button>
                    </li>
                    {/* blocked subscriptions */}
                    <li>
                        <button
                            onClick={() => onNavClick("blockSubscription")}
                            className="flex items-center space-x-2 hover:text-red-500 w-full hover:cursor-pointer"
                        >
                            <FaBan />{" "}
                            {isOpen && <span> Block Subscription </span>}
                        </button>
                    </li>
                    {/* un blocked subscriptions */}
                    <li>
                        <button
                            onClick={() => onNavClick("unblockSubscription")}
                            className="flex items-center space-x-2 hover:text-red-500 w-full hover:cursor-pointer"
                        >
                            <FaCheckCircle />{" "}
                            {isOpen && <span> Unblock Subscription </span>}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
