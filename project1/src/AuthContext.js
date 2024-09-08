import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    let sessionTimeout; // Variable to hold the session timeout ID

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setIsAuthenticated(true);
            // Check if the session has expired
            const sessionStartTime = localStorage.getItem('sessionStartTime');
            if (sessionStartTime) {
                const now = new Date().getTime();
                const elapsed = now - parseInt(sessionStartTime, 10);

                if (elapsed > 60 * 60 * 1000) { // 30 minutes in milliseconds
                    handleSessionExpiry();
                } else {
                    startSessionTimer(60 * 60 * 1000 - elapsed);
                }
            }
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const login = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('sessionStartTime', new Date().getTime()); // Save session start time
        setIsAuthenticated(true);
        startSessionTimer(60 * 60 * 1000); // 30 minutes
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('sessionStartTime');
        clearTimeout(sessionTimeout); // Clear session timer
        setIsAuthenticated(false);
        navigate('/login');
    };

    const handleSessionExpiry = () => {
        alert('Session expired, please log in again');
        logout();
    };

    const startSessionTimer = (duration) => {
        clearTimeout(sessionTimeout); // Clear any existing timer
        sessionTimeout = setTimeout(() => {
            handleSessionExpiry();
        }, duration);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
