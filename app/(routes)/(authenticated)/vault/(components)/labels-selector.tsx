"use client"
import { cn } from "@/lib/utils";
import { TLabel } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const LabelsSelector = ({
    labels,
    value,
    setValue,
}: {
    labels: TLabel[]
    value: string[]
    setValue: (value: string[]) => void
}) => {
    return (
        <>
            {labels.map((label, index) => {
                const isSelected = value.includes(label.key);

                return (
                    <Badge
                        key={index}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => {
                            if (isSelected) {
                                // 取消：從 searchKeys 移除該 key
                                setValue(value.filter((key) => key !== label.key));
                            } else {
                                // 選取：加入 searchKeys
                                setValue([...value, label.key]);
                            }
                        }}
                        className={cn(
                            "mr-2 mb-2 text-sm cursor-pointer w-fit dark:bg-black",
                            !isSelected && "bg-white"
                        )}
                    >
                        {label.name}
                    </Badge>
                );
            })}
        </>
    );
}

export default LabelsSelector;