import { Suspense } from "react";

import AccountForm from "@/components/account-form";
import ButtonLogout from "@/components/button-logout"
import SuspenseTable from "@/components/suspense-table";

export default async function Home() {

    return (
        <div className="w-full pt-10 px-4 md:w-3/4 md:mx-auto">
            <nav className="flex justify-between mb-4 space-x-2">
                <div className=" flex justify-center items-center gap-3">
                    <AccountForm type="add" />
                </div>
                <ButtonLogout />
            </nav>
            <Suspense fallback={<div className="text-center py-4">Loading table...</div>}>
                <SuspenseTable />
            </Suspense>
        </div>
    )
}
