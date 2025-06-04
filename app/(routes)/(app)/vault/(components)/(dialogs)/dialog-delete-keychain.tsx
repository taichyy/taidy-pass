"use client";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { Trash2Icon } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import FormKeychain from "../(forms)/form-keychain";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const DialogDeleteKeyChain = ({
    mutate
}: {
    mutate?: KeyedMutator<any>;
}) => {
    const [opened, setOpened] = useState(false);

    return (
        <Dialog onOpenChange={(e) => setOpened(e)} open={opened}>
            <Tooltip>
                <TooltipTrigger>
                    <DialogTrigger asChild>
                        <Trash2Icon />
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    刪除自訂鑰匙圈
                </TooltipContent>
            </Tooltip>
            <DialogContent className="w-[90%]">
                <DialogHeader>
                    <DialogTitle>
                        刪除鑰匙圈
                    </DialogTitle>
                    <DialogDescription>
                        此動作將永久刪除鑰匙圈及其所有內容，我們無法為您恢復。
                    </DialogDescription>
                    <Separator />
                    <FormKeychain setOpened={setOpened} mutate={mutate} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default DialogDeleteKeyChain;