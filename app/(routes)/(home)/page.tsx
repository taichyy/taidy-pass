import { Suspense } from "react";

import AddForm from "@/components/add-form"
import ButtonLogout from '@/components/button-logout'
import SuspenseTable from "@/components/suspense-table";

export default async function Home() {

    return (
        <div className='w-full pt-10 px-4 md:w-3/4 md:mx-auto'>
            <nav className='flex justify-end mb-4 space-x-2'>
                <AddForm />
                <ButtonLogout />
            </nav>
            <Suspense fallback={<div className="text-center py-4">Loading table...</div>}>
                <SuspenseTable />
            </Suspense>
        </div>
    )
}
