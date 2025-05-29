import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const BlogLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <>
            <section className="pb-32 py-16">
                <div className="container max-w-7xl">
                    <Link href="/">
                        <Button
                            type="button"
                            variant="outline"
                            className="mb-8"
                        >
                            <ArrowLeft 
                                size={16} 
                                className="mr-1"                            
                            /> 返回
                        </Button>
                    </Link>
                    {children}
                </div>
            </section>
        </>
    );
}

export default BlogLayout;