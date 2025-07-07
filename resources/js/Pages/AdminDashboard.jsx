import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SideBar from '../Components/SideBar';
import Header from "../Components/Header";
import ClientRegistration from './Subscriptions/Create';
import UpdateSubscription from "./Subscriptions/Update";

export default function AdminScreenPage(){
    
    const [currentView, setCurrentView] = useState("register");
    const location = useLocation();

        useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const view = queryParams.get("view");

        if (view) {
            setCurrentView(view);
        }
    }, [location]);

    const renderComponent = () => {
        switch (currentView) {
            case "register":
                return <ClientRegistration />;
            case "renewSubscription":
                return <UpdateSubscription />;
            case "subscribedUsers":
                return <div> Subscribed Users </div>;
            default:
                return <ClientRegistration />;
        }
    };

        const handleCancel = () => {
        setCurrentView("analytics");
    };

    return (
       <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="flex flex-1 overflow-hidden">
                <SideBar onNavClick={setCurrentView} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-6">
                        {renderComponent()}
                    </main>
                </div>
            </div>
        </div>
        
    );
}