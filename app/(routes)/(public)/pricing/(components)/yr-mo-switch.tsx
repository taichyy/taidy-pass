"use client"
import { useRouter } from "next/navigation";

import { Switch } from "@/components/ui/switch";

const YrMoSwitch = ({
    isYearly,
}:{
    isYearly: boolean;
}) => {
    const router = useRouter();

    return (
        <div className="flex items-center gap-3 text-lg">
            月費
            <Switch
                checked={isYearly}
                onCheckedChange={() => router.push(
                    isYearly
                    ? `/pricing`
                    : `/pricing?isYearly=true`
                )}
            />
            年費
        </div>
    );
}

export default YrMoSwitch;