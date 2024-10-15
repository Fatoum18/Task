import React, { createContext, useState, useEffect } from "react";
import { authentication } from "./config";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authentication, (currentUser) => {
            if (!registering) {

                setUser(currentUser);
            }
            setLoading(false);
        });

        // Clean up the subscription on unmount
        return unsubscribe;
    }, [registering]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading , registering, setRegistering }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;