"use client"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"  
import { Button } from "./ui/button";
import { useDoubleCheckStore } from "@/lib/stores/use-double-check-store";

const DialogDoubleCheck = ({
    title,
    desc,
    doFunction,
    disabled = false,
    server = false,
}:{
    title: string,
    desc?: string,
    doFunction: any
    disabled?: boolean,
    server?: boolean
}) => {
    const router = useRouter()

    const { open, setOpen } = useDoubleCheckStore()

    const handleSubmit = async () => {
        try {
            await doFunction()

            server && router.refresh()
            setOpen(false)
            toast.success("操作成功！")
        } catch (err) {
            console.error("Error in function in DialogDoubleCheck: " + err)
            setOpen(false)
            toast.error("發生錯誤，請稍後再試！")
        }
    }

    return (
        <Dialog onOpenChange={(e) => setOpen(e)} open={open}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>
                    {title}
                </DialogTitle>
                {desc && (
                    <DialogDescription>
                        {desc}
                    </DialogDescription>
                )}
                </DialogHeader>
                <div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            className=" text-black px-4 py-2"
                            onClick={() => setOpen(false)}
                            variant="outline"
                            disabled={disabled}
                        >
                            取消
                        </Button>
                        <Button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
                            onClick={handleSubmit}
                            disabled={disabled}
                        >
                            確定
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
 
export default DialogDoubleCheck;