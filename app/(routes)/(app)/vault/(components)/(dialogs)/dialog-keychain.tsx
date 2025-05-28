"use client";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { FolderKey } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import FormKeychain from "../(forms)/form-keychain";

const DialogKeyChain = ({
    mutate
}: {
    mutate?: KeyedMutator<any>;
}) => {
    const [opened, setOpened] = useState(false);

    return (
        <Dialog onOpenChange={(e) => setOpened(e)} open={opened}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger>
                        <FolderKey />
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    新增鑰匙圈
                </TooltipContent>
            </Tooltip>
            <DialogContent className="w-[90%]">
                <DialogHeader>
                    <DialogTitle>
                        新增鑰匙圈
                    </DialogTitle>
                    <DialogDescription>
                        除預設鑰匙圈外，您可以新增多個鑰匙圈來分類您的帳號。<br />
                        只要您不透露金鑰，將沒有任何人－包括我們，會知道您儲存的資訊。
                    </DialogDescription>
                    <Separator />
                    <FormKeychain setOpened={setOpened} mutate={mutate} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default DialogKeyChain;