"use client";
import { createContext, ReactNode, useContext } from "react";

type KeyContextType = {
    key: string | null;
    setKey: (keySetToLocalStorage: string) => void;
    salt: string | null;
    setSalt: (saltSetToLocalStorage: string) => void;
    keyOfKeychains?: {
        // key -> _id of specefic custom keychain
        [key: string]: string;
    }
    setKeyOfKeychains: (key: string, keychain: string | null) => void;
};

const KeyContext = createContext<KeyContextType | undefined>(undefined);

export const ProviderKey = ({ children }: { children: ReactNode }) => {
    // Check from localStorage
    // This should not be user-entered key, but a derived key (encoded with salt)
    const key = typeof window != "undefined" && localStorage.getItem("user-derive-key") || "";
    // Fetched at login or register, and stored in localStorage
    const salt = typeof window != "undefined" && localStorage.getItem("user-salt") || "";
    // This should not be user-entered key, but a collection of derive keys (encoded with salt)
    const keyOfKeychains = typeof window != "undefined" ? JSON.parse(localStorage.getItem("user-derive-keys") || "[]") : [];
    
    const setKey = (keySetToLocalStorage: string) => {
        localStorage.setItem("user-derive-key", keySetToLocalStorage);
    }
    const setSalt = (saltSetToLocalStorage: string) => {
        localStorage.setItem("user-salt", saltSetToLocalStorage);
    }
    const setKeyOfKeychains = (key: string, keychain: string | null) => {
        const existingKeys = keyOfKeychains || {};
        const updatedKeys = { ...existingKeys, [key]: keychain };

        // Update the key of keychains in localStorage
        if (keychain === null) {
            delete updatedKeys[key];
        }
        
        localStorage.setItem("user-derive-keys", JSON.stringify(updatedKeys));
    };
    
    return (
        <KeyContext.Provider value={{ key, setKey, salt, setSalt, keyOfKeychains, setKeyOfKeychains }}>
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