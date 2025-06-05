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
    id,
    title,
    desc,
    doFunction,
    disabled = false,
    server = false,
    force,
}: {
    id: string,
    title: string,
    desc?: string,
    doFunction: any
    disabled?: boolean,
    server?: boolean,
    force?: boolean
}) => {
    const router = useRouter()

    const { open, setDoubleCheckOpen } = useDoubleCheckStore()

    const currentOpen = open[id] || false

    const handleSubmit = async () => {
        try {
            await doFunction()

            server && router.refresh()
            toast.success("操作成功！")
        } catch (err) {
            console.error("Error in function in DialogDoubleCheck: " + err)
            toast.error("發生錯誤，請稍後再試！")
        } finally {
            setDoubleCheckOpen(id, false)
        }
    }

    return (
        <Dialog onOpenChange={(e) => setDoubleCheckOpen(id, e)} open={force || currentOpen}>
            <DialogContent btn={!force}>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {desc}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="flex justify-end gap-2 mt-4">
                        {!force && (
                            <Button
                                className=" text-black px-4 py-2"
                                onClick={() => setDoubleCheckOpen(id, false)}
                                variant="outline"
                                disabled={disabled}
                            >
                                取消
                            </Button>
                        )}
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