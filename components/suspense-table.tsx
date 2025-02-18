import { headers } from "next/headers";

import MainTable from './main-table'

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


const SuspenseTable = async () => {
    const accounts = await getData()

    return (
        <MainTable accounts={accounts} />
    )
}

export default SuspenseTable