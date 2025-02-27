import { Suspense } from "react";

import SuspenseTable from "@/components/suspense-table";

export default async function Home() {

    return (
        <div className="w-full pt-10 px-4 md:w-3/4 md:mx-auto">
            <Suspense fallback={<div className="text-center py-4">Loading table...</div>}>
                <SuspenseTable />
            </Suspense>
        </div>
    )
}
