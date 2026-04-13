import Link from "next/link";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import LogoText from "@/components/logo-text";
import { TJWTPayload, TLabel } from "@/lib/types";
import TableMain from "./(components)/table-main";
import ButtonBackToTop from "@/components/buttons/button-back-to-top";
import { StickyHeaderWrapper } from "./(components)/sticky-header-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DialogAdminSettings from "./(components)/(dialogs)/dialog-admin-settings";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

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

    const token = (await cookies()).get("token")?.value
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
                    <span className="text-bold hidden sm:block">
                        {username}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className="border-2 border-slate-400 dark:border-white rounded-full flex justify-center items-center group cursor-pointer">
                                <AvatarImage
                                    src="/logo.png"
                                    alt="@user"
                                />
                                <AvatarFallback>Taidy</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>帳戶</DropdownMenuLabel>
                                <Link href="/logout">
                                    <DropdownMenuItem>
                                        登出
                                    </DropdownMenuItem>
                                </Link>
                                {/* <DropdownMenuItem>Billing</DropdownMenuItem> */}
                            </DropdownMenuGroup>
                            {/* <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>Team</DropdownMenuItem>
                                <DropdownMenuItem>Subscription</DropdownMenuItem>
                            </DropdownMenuGroup> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </StickyHeaderWrapper>
            {/* // Use fixed width insteawd of %, because Dialog opening somehow change the width. */}
            <div className="w-[95%] mx-auto pt-5 px-4 md:mx-auto">
                {/* This includes admin settings, add, logout, and switch key buttons. */}
                {/* The children would be placed in front of the add button. */}
                <ResizablePanelGroup
                    direction="horizontal"
                >
                    <ResizablePanel defaultSize={80}>
                        <TableMain labels={labels}>
                            <DialogAdminSettings
                                role={role}
                                labels={labels}
                            />
                        </TableMain>
                    </ResizablePanel>
                    <ResizableHandle withHandle className="mx-4" />
                    <ResizablePanel defaultSize={20}>
                        
                    </ResizablePanel>
                </ResizablePanelGroup>
                {/* This is fixed positioned */}
                <ButtonBackToTop />
            </div>
        </>

    )
}

export default VaultPage;