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

    const { key, keyOfKeychains } = useKey()

    let insertedKeyVal: string | undefined;

    // If it's a custom keychain, checkk if there is a key in keyOfKeychains.
    if (keychainId && keyOfKeychains) {
        const keychainKey = keyOfKeychains[keychainId];
        if (keychainKey) {
            insertedKeyVal = keychainKey;
        }
    }

    // If it's a default keychain, check if there is a key.
    if (!keychainId && key && key != "") {
        console.log(keychainId)
        insertedKeyVal = key;
    }

    const { setDoubleCheckOpen } = useDoubleCheckStore()

    const [loading, setLoading] = useState(false);
    const [searchKeys, setSearchKeys] = useState<string[]>([]);
    const [formData, setFormData] = useState<TFormData>({
        title: "",
        username: "",
        password: "",
        remark: "",
        label: []
    });

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
        if (data && isEdit && insertedKeyVal) {
            setFormData({
                title: AESDecrypt(data.title, insertedKeyVal),
                username: AESDecrypt(data.username, insertedKeyVal),
                password: AESDecrypt(data.password, insertedKeyVal),
                remark: AESDecrypt(data.remark, insertedKeyVal),
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
        if ( loading ) {
            return;
        }
        
        setLoading(true);
        e.preventDefault()

        const userId = await getUserId()

        const url = isEdit ? `/api/accounts/${id}?mode=account` : `/api/accounts/`
        const method = isEdit ? "PUT" : "POST"

        const clientKey = insertedKeyVal || ""

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
            const req = await fetch(url, {
                method,
                body: JSON.stringify(encryptedObj)
            })

            const res = await req.json();


            if (res.type == "error") {
                toast.error(errorText)
            } else {               
                toast.success(successText)
                setOpened(false)
                mutate && mutate()
            }
        } catch (err) {
            console.log(err)
            toast.error(errorText)
        }

        setLoading(false);
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
                                onClick={() => setDoubleCheckOpen("account-delete", true)}
                                disabled={loading}
                            >
                                刪除
                            </Button>
                        )}
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="mt-4"
                        >
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
                id="account-delete"
                title="確定要刪除這筆資料嗎？"
                doFunction={handleDelete}
                server={true}
                disabled={loading}
            />
        </>
    );
};

export default FormAccount;