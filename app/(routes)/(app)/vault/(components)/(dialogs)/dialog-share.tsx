import { Share } from "lucide-react";

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

const DialogShare = () => {
    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger>
                        <Share size={20} className="text-slate-600" />
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    帳號分享
                </TooltipContent>
            </Tooltip>
            <DialogContent className="w-[90%]">
                <DialogHeader>
                    <DialogTitle>
                        帳號分享
                    </DialogTitle>
                    <DialogDescription>
                        透過超連結與密碼，分享資訊給其他人
                    </DialogDescription>
                    <Separator />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default DialogShare;