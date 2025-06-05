"use client";
import { useState } from "react";
import { Key, X } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import FormSetKey from "../(forms)/form-set-key";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const DialogSetKey = ({
    keychainId,
    keyCorrect,
}: {
    keychainId?: string;
    keyCorrect: boolean | null;
}) => {
    const [opened, setOpened] = useState(false);

    const triedAndFailed = keyCorrect === false;

    return (
        <Dialog onOpenChange={(e) => setOpened(e)} open={opened}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger>
                        <div className="flex flex-col items-center">
                            {triedAndFailed ? (
                                <Key size={32} className="text-red-500 mb-2 cursor-pointer" />
                            ) : (
                                <Key size={32} className="text-slate-600 mb-2 cursor-pointer" />
                            )}
                            <span className="text-lg font-semibold flex items-center">
                                {triedAndFailed ? "解碼錯誤" : "請輸入金鑰"}
                            </span>
                            <span className="text-sm text-slate-500">
                                {triedAndFailed ? "請確認您輸入的是正確的金鑰，點擊以再度嘗試" : "請輸入保存的金鑰來解鎖自訂鑰匙圈"}
                            </span>
                        </div>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    輸入金鑰
                </TooltipContent>
            </Tooltip>
            <DialogContent className="w-[90%]">
                <DialogHeader>
                    <DialogTitle>
                        輸入金鑰
                    </DialogTitle>
                    <DialogDescription>
                        只要您不透露金鑰，將沒有任何人－包括我們，會知道您儲存的資訊。
                    </DialogDescription>
                    <Separator />
                    <FormSetKey
                        setOpened={setOpened}
                        keychainId={keychainId}
                    />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default DialogSetKey;