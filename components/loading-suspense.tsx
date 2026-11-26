import { SyncLoader } from "react-spinners";
import { ReactNode, Suspense } from "react";

import { cn } from "@/lib/utils";

const LoadingUI = (props:{
    type?: "block" | "fixed";
}) => {
    const { type } = props;

    return (
        <div className={cn(
            "flex justify-center items-center",
            type === "fixed" && "fixed top-0 left-0 w-full h-full bg-slate-100/50 z-50",
        )}>
            <SyncLoader color="#F97316" />
        </div>
    );
};

const LoadingSuspense = (props: {
    children: ReactNode;
    suspenseKey?: string;
    type?: "block" | "fixed";
}) => {
    const { children, suspenseKey, type = "block" } = props;

    return (
        <Suspense key={suspenseKey} fallback={<LoadingUI type={type} />}>
            {children}
        </Suspense>
    );
};

export default LoadingSuspense;