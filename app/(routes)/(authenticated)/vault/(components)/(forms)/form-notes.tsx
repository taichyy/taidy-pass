"use client"
import toast from "react-hot-toast";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { encryptRecordNote } from "@/lib/actions";
import ControlledInput from "@/components/controlled-input";

type TFormData = {
    title: string;
    context: string;
};
const FormNotes = () => {
    const [opened, setOpened] = useState(false);
    const [formData, setFormData] = useState<TFormData>({
        title: "",
        context: "",
    });

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // For Add and edit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const noteKey = process.env.NOTE_SECRET as string

        const url = "/api/notes/"
        const method = "POST"

        if (!e.target) {
            return;
        }

        const form = e.target as HTMLFormElement;
        const title = (form.elements.namedItem("title") as HTMLInputElement).value
        const context = (form.elements.namedItem("context") as HTMLInputElement).value

        const obj = {
            title,
            context,
        }
        const encryptedObj = await encryptRecordNote(obj, noteKey)

        try {
            await fetch(url, {
                method,
                body: JSON.stringify(encryptedObj)
            })

            toast.success("新增成功！")
            setOpened(false)
        } catch (err) {
            toast.error("新增失敗！")
        }
    }

    const inputs = [
        {
            id: "title",
            type: "text",
            value: formData.title,
            label: "項目"
        },
        {
            id: "context",
            type: "text",
            value: formData.context,
            label: "內文"
        },
    ]

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
                <Button type="submit" className="mt-4">
                    確定新增
                </Button>
            </div>
        </form>
    );
}

export default FormNotes;