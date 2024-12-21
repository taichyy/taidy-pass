import AddForm from "@/components/add-form"
import MainTable from '@/components/main-table'
import ButtonLogout from '@/components/button-logout'
import { headers } from "next/headers";

const getData = async () => {
    const headersList = headers();
    
    const protocol = headersList.get('x-forwarded-proto');
    const domain = headersList.get('host');
    const url = `${protocol}://${domain}/api/accounts`;
    
    try {
        const response = await fetch(url)
        const data = await response.json()
        
        return data
    } catch ( error ) {
        console.error(error)
    }
}

export default async function Home() {
    const accounts = await getData()
    
    return (
        <div className='w-full pt-10 px-4 md:w-3/4 md:mx-auto'>
            <nav className='flex justify-end mb-4 space-x-2'>
                <AddForm />
                <ButtonLogout />
            </nav>
            <MainTable accounts={accounts} />
        </div>
    )
}
