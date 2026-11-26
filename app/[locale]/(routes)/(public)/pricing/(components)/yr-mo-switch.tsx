"use client"

import { useRouter } from "next/navigation";

import { Switch } from "@/components/ui/switch";

const YrMoSwitch = (props:{
    isYearly: boolean;
}) => {
    const { isYearly } = props;

    const router = useRouter();

    return (
        <div className="flex items-center gap-3 text-lg">
            月費
            <Switch
                checked={isYearly}
                onCheckedChange={() => router.push(
                    isYearly
                    ? `/pricing`
                    : `/pricing?isYearly`
                )}
            />
            年費
        </div>
    );
}

export default YrMoSwitch;