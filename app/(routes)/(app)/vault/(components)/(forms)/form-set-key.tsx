"use client"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { deriveRawKey } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ControlledInput from "@/components/controlled-input";
import { useKey } from "@/components/providers/provider-key";

// S5tpthRBQHgi1vrcn5WpdVIowTxVyv97pE6OPdm7Sfg=
type TFormData = {
    base64Key: string;
};
const FormSetKey = ({
    setOpened,
    keychainId,
}:{
    setOpened: (opened: boolean) => void;
    keychainId?: string;
}) => {
    const router = useRouter();

    const { salt, setKeyOfKeychains } = useKey();

    const [formData, setFormData] = useState<TFormData>({
        base64Key: "",
    });

    const inputs = [
        {
            id: "base64Key",
            type: "text",
            value: formData.base64Key,
            label: "金鑰"
        },
    ]
    
    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // For Add and edit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!e.target) {
            return;
        }

        const form = e.target as HTMLFormElement;
        const base64Key = (form.elements.namedItem("base64Key") as HTMLInputElement).value

        if (!base64Key) {
            toast.error("請輸入金鑰");
            return;
        }

        if (!salt) {
            toast.error("無法取得加密鹽值，請重新登入");
            return;
        }

        const derivedKey = await deriveRawKey(base64Key, salt)
        keychainId && setKeyOfKeychains(keychainId, derivedKey);

        toast.success("設定成功");
        setOpened(false);
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className="text-left flex flex-col gap-3">
        {inputs.map((input) => (
            <ControlledInput
                key={input.id}
                id={input.id}
                type={input.type as "text" | "email" | "password" | "textarea"}
                label={input.label}
                value={input.value}
                onChange={handleChange}
            />
        ))}
        <div className=" flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => {
                setOpened(false)
            }}>
                取消
            </Button>
            <Button type="submit">
                確定
            </Button>
        </div>
    </form>
    );
}
 
export default FormSetKey;