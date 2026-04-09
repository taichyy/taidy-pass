"use client"
import { useState, useEffect } from "react";

import { getUserId } from "@/lib/actions";
import { EmailVerificationModal } from "@/components/email-verification-modal";

interface EmailVerificationWrapperProps {
    children: React.ReactNode;
}

export function EmailVerificationWrapper({ children }: EmailVerificationWrapperProps) {
    const [showModal, setShowModal] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkVerificationStatus();
    }, []);

    const checkVerificationStatus = async () => {
        try {
            const userId = await getUserId()

            const response = await fetch(`/api/users/${userId}?type=email-check`);
            const result = await response.json();

            if (result.status && result.data) {
                const { emailVerified, email } = result.data;
                setUserEmail(email);
                console.log(result)
                if (!emailVerified) {
                    setShowModal(true);
                }
            }
        } catch (error) {
            console.error("檢查驗證狀態錯誤:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        // 重新檢查驗證狀態
        checkVerificationStatus();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">載入中...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {children}
            <EmailVerificationModal
                isOpen={showModal}
                onClose={handleCloseModal}
                userEmail={userEmail}
            />
        </>
    );
}