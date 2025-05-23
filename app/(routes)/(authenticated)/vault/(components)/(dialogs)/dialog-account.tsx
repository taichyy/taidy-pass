"use client";
import { KeyedMutator } from "swr";
import { useState, ReactNode } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { TLabel } from "@/lib/types";
import FormAccount from "../(forms)/form-account";
import { Separator } from "@/components/ui/separator";

const DialogAccount = ({
    labels,
    id,
    mutate,
    keychainId,
    children,
}: {
    labels?: TLabel[];
    id?: string;
    mutate?: KeyedMutator<any>;
    keychainId?: string;
    children: ReactNode;
}) => {
    const [opened, setOpened] = useState(false);

    const isEdit = !!id;
    const title = isEdit ? "編輯紀錄" : "新增紀錄";

    return (
        <Dialog onOpenChange={setOpened} open={opened}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-[90%]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        只要您不透露金鑰，將沒有任何人－包括我們，會知道您儲存的資訊。
                    </DialogDescription>
                    <Separator />
                    <FormAccount
                        labels={labels}
                        id={id}
                        mutate={mutate}
                        setOpened={setOpened}
                        opened={opened}
                        keychainId={keychainId}
                    />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default DialogAccount;
