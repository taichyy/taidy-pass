import Link from "next/link";
import { jwtVerify } from "jose";
import { Pencil } from "lucide-react";
import { cookies } from "next/headers";

import LogoText from "@/components/logo-text";
import { TJWTPayload, TLabel } from "@/lib/types";
import TableMain from "./(components)/table-main";
import { Separator } from "@/components/ui/separator";
import ButtonBackToTop from "@/components/buttons/button-back-to-top";
import { StickyHeaderWrapper } from "./(components)/sticky-header-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DialogAdminSettings from "./(components)/(dialogs)/dialog-admin-settings";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const getLabels = async (token: string) => {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/labels?method=get`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    })

    const res = await req.json()

    return res
}

const VaultPage = async () => {
    // Always check this
    const jwtSecret = process.env.JWT_SECRET || "";

    const token = cookies().get("token")?.value
    const decoded = await jwtVerify(token || "", new TextEncoder().encode(jwtSecret))

    const jwt = decoded?.payload as TJWTPayload

    const role: "user" | "admin" = jwt.role || "user"
    const username: string = jwt.username || ""

    const fetchedLabels = await getLabels(token || "")
    const labels: TLabel[] = fetchedLabels?.data || []

    return (
        <>
            <StickyHeaderWrapper>
                <LogoText />
                <div className="flex items-center gap-2">
                    <span className="text-bold">
                        {username}
                    </span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                                <Link href="/settings">
                                    <Avatar className="border-2 border-slate-400 dark:border-white rounded-full flex justify-center items-center group cursor-pointer">
                                        <Pencil className="hidden group-hover:block" />
                                        <AvatarImage
                                            src="/logo.png"
                                            alt="@user"
                                            className="block group-hover:hidden"
                                        />
                                        <AvatarFallback>Taidy</AvatarFallback>
                                    </Avatar>
                                </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            使用者設定
                        </TooltipContent>
                    </Tooltip>
                </div>
            </StickyHeaderWrapper>
            {/* // Use fixed width insteawd of %, because Dialog opening somehow change the width. */}
            <div className="w-[95%] sm:w-[520px] mx-auto pt-10 px-4 md:w-[700px] lg:w-[1020px] xl:w-[1250px] md:mx-auto">
                <Separator className="my-4" />
                {/* This includes admin settings, add, logout, and switch key buttons. */}
                {/* The children would be placed in front of the add button. */}
                <TableMain labels={labels}>
                    <DialogAdminSettings
                        role={role}
                        labels={labels}
                    />
                </TableMain>
                {/* This is fixed positioned */}
                <ButtonBackToTop />
            </div>
        </>

    )
}

export default VaultPage;