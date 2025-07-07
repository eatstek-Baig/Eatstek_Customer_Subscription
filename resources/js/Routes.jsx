import React, { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Preloader from "./Pages/Preloader";
import { usesAuthContext } from "./lib/contexts/AuthContext";

const AdminLogin = lazy(() => import("./Pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard"));
const NotFoundPage = lazy(() => import("./Pages/NotFoundPage"));

const PrivateRoutes = ({ element }) => {
    const { user } = usesAuthContext();
    return user ? element : <Navigate to="/login" />;
};

const AppRoutes = () => {
    
    const { user } = usesAuthContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [user]);
    if (isLoading) {
        return <Preloader />;
    }

    return (
        <Router>
            <Suspense fallback={<Preloader />}>
            <Routes>

                {/* public routes */}
                <Route path="/login" 
                element={
                    user ? <Navigate to="/dashboard" replace /> : 
                <AdminLogin />} />
                {/* private route */}

 <Route
                        path="/dashboard"
                        element={<PrivateRoutes element={<AdminDashboard />} />}
                    />
                {/* catch all Redirect */}
                <Route path="/" element={<Navigate to={user ? "/dashboard" :"/login" } replace />} />

                {/* <Route path="/login" element={<AdminLogin />} /> */}
                    <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;