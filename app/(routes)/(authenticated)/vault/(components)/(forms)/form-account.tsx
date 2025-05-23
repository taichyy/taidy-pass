"use client";
import { toast } from "react-hot-toast";
import useSWR, { KeyedMutator } from "swr";
import { useState, useEffect, FormEvent } from "react";

import { TLabel } from "@/lib/types";
import LabelsSelector from "../labels-selector";
import { Button } from "@/components/ui/button";
import { AESDecrypt, fetcher } from "@/lib/utils";
import { encryptRecord, getUserId } from "@/lib/actions";
import ControlledInput from "@/components/controlled-input";
import { useKey } from "@/components/providers/provider-key";
import DialogDoubleCheck from "@/components/dialog-double-check";
import { useDoubleCheckStore } from "@/lib/stores/use-double-check-store";

type TFormData = {
    title: string;
    username: string;
    password: string;
    remark: string;
    label: string[];
    keychainId?: string;
};
const FormAccount = ({
    labels,
    id,
    mutate,
    opened,
    setOpened,
    keychainId,
}: {
    labels?: TLabel[]
    id?: string; // Required for edit mode
    mutate?: KeyedMutator<any>;
    opened: boolean;
    setOpened: (open: boolean) => void;
    keychainId?: string;
}) => {
    const isEdit = !!id;

    const { key } = useKey();
    const { setOpen } = useDoubleCheckStore()

    const [searchKeys, setSearchKeys] = useState<string[]>([]);
    const [formData, setFormData] = useState<TFormData>({
        title: "",
        username: "",
        password: "",
        remark: "",
        label: []
    });

    console.log(key)

    // EDIT mode as default value.
    let btnText = "編輯"
    let successText = "編輯成功！"
    let errorText = "編輯失敗！"

    if (!isEdit) {
        btnText = "新增"
        successText = "新增成功！"
        errorText = "新增失敗，請稍後再試！"
    }

    // Fetch existing data for edit mode
    const { data: fetched, error, isLoading } = useSWR(
        isEdit && opened ? `/api/accounts/${id}` : null,
        (url) => fetcher(url),
    );
    const data = fetched?.data;

    // Sync fetched data with formData when in edit mode
    useEffect(() => {
        if (data && isEdit && key) {
            setFormData({
                title: AESDecrypt(data.title, key),
                username: AESDecrypt(data.username, key),
                password: AESDecrypt(data.password, key),
                remark: AESDecrypt(data.remark, key),
                label: searchKeys,
            });
        }
    }, [data, id]);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // For Add and edit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const userId = await getUserId()

        const url = isEdit ? `/api/accounts/${id}` : `/api/accounts/`
        const method = isEdit ? "PUT" : "POST"

        const clientKey = key || ""

        if (!e.target) {
            return;
        }

        const form = e.target as HTMLFormElement;
        const title = (form.elements.namedItem("title") as HTMLInputElement).value
        const username = (form.elements.namedItem("username") as HTMLInputElement).value
        const password = (form.elements.namedItem("password") as HTMLInputElement).value
        const remark = (form.elements.namedItem("remark") as HTMLInputElement).value

        const obj: any = {
            title,
            username,
            password,
            remark,
            label: searchKeys,
            userId,
        }
        if ( keychainId ) {
            obj.keychainId = keychainId
        }
        const encryptedObj = await encryptRecord(obj, clientKey)

        try {
            await fetch(url, {
                method,
                body: JSON.stringify(encryptedObj)
            })

            toast.success(successText)
            setOpened(false)
            mutate && mutate()
        } catch (err) {
            console.log(err)
            toast.error(errorText)
        }
    }

    // Handle delete (only for edit mode)
    const handleDelete = async () => {
        try {
            await fetch(
                `/api/accounts/${id}`,
                {
                    method: "DELETE"
                }
            );

            mutate && mutate()
            setOpened(false);
        } catch (err) {
            console.error(err);
        }
    };

    const inputs = [
        {
            id: "title",
            type: "text",
            value: formData.title,
            label: "項目"
        },
        {
            id: "username",
            type: "text",
            value: formData.username,
            label: "帳號"
        },
        {
            id: "password",
            type: "text",
            value: formData.password,
            label: "密碼"
        },
        {
            id: "remark",
            type: "textarea",
            value: formData.remark,
            label: "備註"
        },
    ]

    return (
        <>
            {/* Lables (keys) selector, for filtering */}
            <div className="pt-2">
                {labels && (
                    <LabelsSelector
                        labels={labels}
                        value={searchKeys}
                        setValue={setSearchKeys}
                    />
                )}
            </div>
            {isLoading && isEdit && opened ? (
                "Loading..."
            ) : (
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
                        {isEdit && (
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-4"
                                onClick={() => setOpen(true)}
                            >
                                刪除
                            </Button>
                        )}
                        <Button type="submit" className="mt-4">
                            {btnText}
                        </Button>
                    </div>
                </form>
            )}
            {error && (
                <p className="text-red-700">
                    資料獲取錯誤
                </p>
            )}
            <DialogDoubleCheck
                title="確定要刪除這筆資料嗎？"
                doFunction={handleDelete}
                server={true}
            />
        </>
    );
};

export default FormAccount;