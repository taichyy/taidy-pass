import { ReactNode, Suspense } from "react";
import { SyncLoader } from "react-spinners";

import { cn } from "@/lib/utils";

const LoadingUI = ({
    type,
}:{
    type?: "block" | "fixed"
}) => {
    return (
        <div className={cn(
            "flex justify-center items-center",
            type === "fixed" && "fixed top-0 left-0 w-full h-full bg-slate-100/50 z-50",
        )}>
            <SyncLoader color="#F97316" />
        </div>
    )
}

const LoadingSuspense = ({
    children,
    suspenseKey,
    type = "block",
}: {
    children: ReactNode
    suspenseKey?: string
    type?: "block" | "fixed"
}) => {
    return (
        <Suspense key={suspenseKey} fallback={<LoadingUI type={type} />}>
            {children}
        </Suspense>
    );
}

export default LoadingSuspense;