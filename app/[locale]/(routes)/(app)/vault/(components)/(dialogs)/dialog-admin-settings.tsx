import { Settings } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { TLabel } from "@/lib/types";
import FormLabel from "../(forms)/form-label";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Keep this component server component, because it is confidential.
const DialogAdminSettings = async ({
    role,
    labels,
}: {
    role: "user" | "admin",
    labels: TLabel[]
}) => {
    // Double safe check
    if (!role || role == "user") return null;

    return (
        <>
            {/* Not only wrap the conditional rendering with DialogTrigger, but entire component. */}
            {role == "admin" && (
                <Dialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger>
                                <Settings />
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            管理員設定
                        </TooltipContent>
                    </Tooltip>
                    <DialogContent className="w-[90%]">
                        <DialogHeader>
                            <DialogTitle>
                                管理員設定
                            </DialogTitle>
                            <DialogDescription>
                                管理員相關設定
                            </DialogDescription>
                            <Separator />
                            <div className=" flex flex-col gap-3">
                                <div className=" flex flex-col gap-2">
                                    <div>
                                        <h3>系統分類標籤設定</h3>
                                        <h4 className=" text-sm text-slate-400">點擊標籤以編輯，點擊「X」以刪除</h4>
                                    </div>
                                    {/* 新增鍵值 Form */}
                                    <FormLabel labels={labels} />
                                </div>
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

export default DialogAdminSettings;