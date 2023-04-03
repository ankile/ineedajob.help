import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, firestore } from "./firebase";

interface User {
    id: string;
    email: string;
}

interface UserContextProps {
    user: User | null;
    loading: boolean;
}

interface UserProviderProps {
    children: React.ReactNode;
}

const UserContext = createContext<UserContextProps>({
    user: null,
    loading: true,
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(firestore, "users", firebaseUser.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                setUser(userDocSnapshot.data() as User);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
