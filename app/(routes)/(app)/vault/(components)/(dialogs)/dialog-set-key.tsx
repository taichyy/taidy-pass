"use client";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { Key } from "lucide-react";

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
    mutate,
    keychainId,
}: {
    mutate?: KeyedMutator<any>;
    keychainId?: string;
}) => {
    const [opened, setOpened] = useState(false);

    return (
        <Dialog onOpenChange={(e) => setOpened(e)} open={opened}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger>
                        <div className="flex flex-col items-center">
                            <Key size={32} className="text-slate-600 mb-2 cursor-pointer" />
                            <span className="text-lg font-semibold">請輸入金鑰</span>
                            <span className="text-sm text-slate-500">請輸入保存的金鑰來解鎖自訂鑰匙圈</span>
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
                        mutate={mutate} 
                        keychainId={keychainId}
                    />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default DialogSetKey;