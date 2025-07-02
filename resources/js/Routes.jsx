import React, { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Preloader from "./Pages/Preloader";
import { AuthStorage } from "./lib/utils/AuthStorage";

const AdminLogin = lazy(() => import("./Pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard"));
const NotFoundPage = lazy(() => import("./Pages/NotFoundPage"));

const AppRoutes = () => {
    //check auth status
    const isAuthenticated = !!AuthStorage.getToken();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    if(loading) {
        return <Preloader />
    }

    return (
        <Router>
            <Suspense fallback={<Preloader />}>
            <Routes>

                {/* public routes */}
                <Route path="/login" 
                element={
                    // isAuthenticated ? <Navigate to="/dashboard" replace /> : 
                <AdminLogin />} />
                {/* private route */}

                <Route path="/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />} />

                {/* catch all Redirect */}
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" :"/login" } replace />} />

                {/* <Route path="/login" element={<AdminLogin />} /> */}
                    <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;