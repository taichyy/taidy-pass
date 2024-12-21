"use client";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { PenBoxIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const EditForm = ({ id }) => {
    const router = useRouter();
    const [opened, setOpened] = useState(false);

    // 1. Form data state (for input values)
    const [formData, setFormData] = useState({
        title: "",
        username: "",
        password: "",
    });

    // 2. SWR data state (for fetched data from server)
    const { data, error, isLoading, mutate } = useSWR(
        opened && `/api/accounts/${id}`, 
        (url) => fetch(url).then((res) => res.json())
    );

    // 3. Sync data with form data when the fetched data changes
    useEffect(() => {
        if (data) {
            setFormData({
                title: data.title,
                username: data.username,
                password: data.password,
            });
        }
    }, [data]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submit (PUT request)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch(`/api/accounts/${id}`, {
                method: "PUT",
                body: JSON.stringify(formData),
            });

            await mutate(); // Refetch the data after submitting
            router.refresh();
            toast.success("更改成功！");
            setOpened(false); // Close the dialog
        } catch (err) {
            console.error(err);
        }
    };

    // Handle delete action (DELETE request)
    const handleDelete = async () => {
        if (confirm("確定要刪除嗎？")) {
            try {
                await fetch(`/api/accounts/${id}`, { method: "DELETE" });
                await mutate(); // Refetch the data after deleting
                router.refresh();
                toast.success("刪除成功！");
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <Dialog onOpenChange={(e) => setOpened(e)}>
            <DialogTrigger>
                <PenBoxIcon />
            </DialogTrigger>
            <DialogContent className="w-fit">
                <DialogHeader>
                    <DialogTitle>更改資料</DialogTitle>
                    {isLoading && opened ? (
                        "Loading......"
                    ) : (
                        <form onSubmit={handleSubmit} className="text-left">
                            <div>
                                <h2>項目名稱</h2>
                                <Input
                                    name="title"
                                    className="mt-2 w-[600px]"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <h2>帳號</h2>
                                <Input
                                    name="username"
                                    className="mt-2"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <h2>密碼</h2>
                                <Input
                                    name="password"
                                    className="mt-2"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <DialogClose asChild>
                                <Button type="submit" className="mt-4 w-full">
                                    確定編輯
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button
                                    variant="destructive"
                                    className="mt-4 w-full"
                                    onClick={handleDelete}
                                >
                                    刪除
                                </Button>
                            </DialogClose>
                        </form>
                    )}
                </DialogHeader>
                <DialogDescription className="text-red-700">
                    {error && "Error fetching data"}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

export default EditForm;