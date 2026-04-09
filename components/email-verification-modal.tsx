"use client"
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
}

export function EmailVerificationModal({ 
    isOpen, 
    onClose, 
    userEmail 
}: EmailVerificationModalProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    // 檢查 URL 中是否有驗證 token
    useEffect(() => {
        const token = searchParams.get('verify');
        if (token && isOpen) {
            handleVerifyFromUrl(token);
        }
    }, [searchParams, isOpen]);

    const handleVerifyFromUrl = async (token: string) => {
        try {
            const response = await fetch(`/api/verify-email?token=${token}`);
            const result = await response.json();

            if (result.status) {
                toast.success("信箱驗證成功！");
                onClose();
                router.replace('/vault'); // 移除 URL 參數
            } else {
                toast.error(result.message || "驗證失敗");
            }
        } catch (error) {
            console.error("驗證錯誤:", error);
            toast.error("驗證過程發生錯誤");
        }
    };

    const handleSendVerification = async () => {
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/verify-email', {
                method: 'POST',
            });
            
            const result = await response.json();
            
            if (result.status) {
                setVerificationSent(true);

                // PROD -> Send email in back-end
                // DEV  -> Console the verification link
                if (process.env.NEXT_PUBLIC_ENV == "PROD") {
                    toast.success("驗證郵件已發送！");
                } else if (process.env.NEXT_PUBLIC_ENV == "DEV") {
                    const verifyUrl = `${window.location.origin}/vault?verify=${result.verificationToken}`;
                    console.log("驗證連結:", verifyUrl);
                } 
            } else {
                toast.error(result.message || "發送失敗");
            }
        } catch (error) {
            console.error("發送驗證郵件錯誤:", error);
            toast.error("發送過程發生錯誤");
        }
        
        setIsLoading(false);
    };

    const handleResendVerification = () => {
        setVerificationSent(false);
        handleSendVerification();
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md" btn={false}>
                <DialogHeader>
                    <DialogTitle>驗證您的信箱</DialogTitle>
                    <DialogDescription>
                        為了確保帳戶安全，請先驗證您的信箱地址
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        我們將發送驗證連結到：
                        <div className="font-medium text-foreground mt-1">
                            {userEmail.split("@")[0].length <=3 
                                ? userEmail 
                                : userEmail.split("@")[0].substring(0, 3) + "*".repeat(userEmail.split("@")[0].length - 3) + "@" + userEmail.split("@")[1]
                            }
                        </div>
                    </div>

                    {!verificationSent ? (
                        <Button 
                            onClick={handleSendVerification}
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? "發送中..." : "發送驗證郵件"}
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <div className="text-sm text-green-600 dark:text-green-400">
                                ✓ 驗證郵件已發送！請檢查您的信箱並點擊驗證連結。
                            </div>
                            <Button 
                                variant="outline"
                                onClick={handleResendVerification}
                                disabled={isLoading}
                                className="w-full"
                            >
                                重新發送
                            </Button>
                        </div>
                    )}

                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        沒有收到郵件？請檢查垃圾郵件資料夾
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}