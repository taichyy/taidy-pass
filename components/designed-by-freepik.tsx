import { cn } from "@/lib/utils";

const DesignedByFreepik = (props:{
    className?: string;
}) => {
    const { className } = props;

    return (
        <span className={cn(
            "text-[11px] flex gap-1 text-slate-400/70",
            className
        )}>
            Designed by{" "} 
            <a
                href="https://www.freepik.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/50 hover:underline"
            >Freepik</a>
        </span>
    );
};
 
export default DesignedByFreepik;