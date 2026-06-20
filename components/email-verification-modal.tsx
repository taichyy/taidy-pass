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
import { getUserId } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
    onEmailUpdate?: (newEmail: string) => void;
}

type ViewMode = "verify" | "change-email";

export function EmailVerificationModal({
    isOpen,
    onClose,
    userEmail,
    onEmailUpdate,
}: EmailVerificationModalProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [view, setView] = useState<ViewMode>("verify");
    const [isLoading, setIsLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    // Change email form state
    const [newEmail, setNewEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // 檢查 URL 中是否有驗證 token
    useEffect(() => {
        const token = searchParams.get("verify");
        if (token && isOpen) {
            handleVerifyFromUrl(token);
        }
    }, [searchParams, isOpen]);

    // Reset view when modal opens
    useEffect(() => {
        if (isOpen) {
            setView("verify");
            setVerificationSent(false);
            setNewEmail("");
            setConfirmEmail("");
            setEmailError("");
        }
    }, [isOpen]);

    const handleVerifyFromUrl = async (token: string) => {
        try {
            const response = await fetch(`/api/verify-email?token=${token}`);
            const result = await response.json();

            if (result.status) {
                toast.success("信箱驗證成功！");
                onClose();
                router.replace("/vault");
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
            const response = await fetch("/api/verify-email", {
                method: "POST",
            });

            const result = await response.json();

            if (result.status) {
                setVerificationSent(true);

                if (process.env.NEXT_PUBLIC_ENV === "PROD") {
                    toast.success("驗證郵件已發送！");
                } else if (process.env.NEXT_PUBLIC_ENV === "DEV") {
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

    const handleLogout = async () => {
        try {
            await fetch("/api/session", { method: "DELETE" });
            toast.success("登出成功！");
        } catch (err) {
            console.error("Logout error:", err);
            toast.error("發生錯誤，請稍後再試！");
        } finally {
            router.push("/");
        }
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleChangeEmail = async () => {
        setEmailError("");

        if (!newEmail.trim()) {
            setEmailError("請輸入新的信箱地址");
            return;
        }
        if (!validateEmail(newEmail)) {
            setEmailError("請輸入有效的信箱格式");
            return;
        }
        if (newEmail.toLowerCase() === userEmail.toLowerCase()) {
            setEmailError("新信箱不能與目前信箱相同");
            return;
        }
        if (newEmail !== confirmEmail) {
            setEmailError("兩次輸入的信箱不一致");
            return;
        }

        setIsLoading(true);

        try {
            const userId = await getUserId();
            if (!userId) {
                toast.error("無法取得用戶資訊");
                return;
            }

            const response = await fetch(`/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newEmail.trim().toLowerCase() }),
            });

            const result = await response.json();

            if (result.status) {
                toast.success("信箱已更新，請重新驗證新信箱");
                onEmailUpdate?.(newEmail.trim().toLowerCase());
                setView("verify");
                setVerificationSent(false);
                setNewEmail("");
                setConfirmEmail("");
            } else {
                toast.error(result.message || "更新失敗");
            }
        } catch (error) {
            console.error("更新信箱錯誤:", error);
            toast.error("更新過程發生錯誤");
        }

        setIsLoading(false);
    };

    const maskedEmail = (email: string) => {
        if (!email) return "";
        const [local, domain] = email.split("@");
        if (!domain) return email;
        if (local.length <= 3) return email;
        return local.substring(0, 3) + "*".repeat(local.length - 3) + "@" + domain;
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md" btn={false}>
                {view === "verify" ? (
                    <>
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
                                    {maskedEmail(userEmail)}
                                </div>
                            </div>

                            <div className="space-y-2">
                                {!verificationSent ? (
                                    <Button
                                        onClick={handleSendVerification}
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        {isLoading ? "發送中..." : "發送驗證郵件"}
                                    </Button>
                                ) : (
                                    <div className="space-y-2">
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

                                <Button
                                    variant="ghost"
                                    onClick={() => setView("change-email")}
                                    className="w-full text-sm text-muted-foreground"
                                    disabled={isLoading}
                                >
                                    信箱填錯了？修改信箱
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="w-full"
                                >
                                    登出
                                </Button>
                            </div>

                            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                沒有收到郵件？請檢查垃圾郵件資料夾
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>修改信箱</DialogTitle>
                            <DialogDescription>
                                輸入新的信箱地址，修改後需重新驗證
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                目前信箱：
                                <span className="font-medium text-foreground ml-1">
                                    {maskedEmail(userEmail)}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-email">新信箱地址</Label>
                                <Input
                                    id="new-email"
                                    type="email"
                                    placeholder="請輸入新的信箱地址"
                                    value={newEmail}
                                    onChange={(e) => {
                                        setNewEmail(e.target.value);
                                        setEmailError("");
                                    }}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-email">確認新信箱</Label>
                                <Input
                                    id="confirm-email"
                                    type="email"
                                    placeholder="再次輸入新的信箱地址"
                                    value={confirmEmail}
                                    onChange={(e) => {
                                        setConfirmEmail(e.target.value);
                                        setEmailError("");
                                    }}
                                    disabled={isLoading}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleChangeEmail();
                                    }}
                                />
                            </div>

                            {emailError && (
                                <p className="text-sm text-red-500">{emailError}</p>
                            )}

                            <div className="space-y-2">
                                <Button
                                    onClick={handleChangeEmail}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    {isLoading ? "更新中..." : "確認修改"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setView("verify");
                                        setNewEmail("");
                                        setConfirmEmail("");
                                        setEmailError("");
                                    }}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    取消
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
