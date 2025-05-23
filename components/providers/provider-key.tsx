"use client";
import { createContext, ReactNode, useContext } from "react";

type KeyContextType = {
    key: string | null;
    setKey: (key: string) => void;
    salt: string | null;
    setSalt: (salt: string) => void;
};

const KeyContext = createContext<KeyContextType | undefined>(undefined);

export const ProviderKey = ({ children }: { children: ReactNode }) => {
    // Check from localStorage
    const key = typeof window != "undefined" && localStorage.getItem("user-key") || "";
    const salt = typeof window != "undefined" && localStorage.getItem("user-salt") || "";

    const setKey = (key: string) => {
        localStorage.setItem("user-key", key);
    }

    const setSalt = (salt: string) => {
        localStorage.setItem("user-salt", salt);
    }

    return (
        <KeyContext.Provider value={{ key, setKey, salt, setSalt }}>
            {children}
        </KeyContext.Provider>
    );
};

export const useKey = () => {
    const context = useContext(KeyContext);
    if (!context) {
        throw new Error("useKey must be used within a ProviderKey");
    }
    return context;
};