"use client"
import { useEffect, useState } from "react"
import { Eye, Pen, PlusCircle, UserCog } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "./ui/input"
import ButtonCopy from "./button-copy"
import TwoFA from "@/components/two-f-a"
import AccountForm from "./account-form"
import ButtonLogout from "./button-logout"

export const dynamic = 'force-dynamic'

type TAccount = {
    _id: string
    type?: string,
    title: string
    username: string
    password: string
}
const MainTable = ({
    accounts
}: {
    accounts: TAccount[]
}) => {
    const [search, setSearch] = useState("")
    const [verified, setVerified] = useState(false)
    const [filtered, setFiltered] = useState<TAccount[]>([])

    useEffect(() => {
        if (accounts) {
            console.log(accounts)
            if (search === '') {
                setFiltered(accounts.filter(record => record.type != "key"));
            } else {
                setFiltered(accounts.filter(record =>
                    (record.title.toLowerCase().includes(search.toLowerCase()) || record.username.toLowerCase().includes(search.toLowerCase())) &&
                    record.type != "key"
                ));
            }
        }
    }, [accounts, search]);

    return (
        <div>
            <nav className="flex justify-between mb-4 space-x-2">
                <div className=" flex justify-center items-center gap-2">
                {verified
                    ? <AccountForm type="add" />
                    : <TwoFA setVerified={setVerified} Icon={PlusCircle} size={24} />
                }
                {verified
                    ? <AccountForm type="key" id={accounts?.filter( item => item.type == "key")?.[0]?._id} />
                    : <TwoFA setVerified={setVerified} Icon={UserCog} size={24} />
                }
                </div>
                <ButtonLogout />
            </nav>
            <Input 
                defaultValue={search} 
                onChange={(e) => (setSearch(e.target.value))} 
                placeholder="搜尋......"
            />
            <Table className=" my-4">
                <TableHeader className="border-t-2 border-b-2">
                    <TableRow>
                        <TableHead>項目</TableHead>
                        <TableHead>帳密</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="relative overflow-x-auto">
                    {filtered && filtered.length > 0 && filtered?.sort((a, b) => a.title.localeCompare(b.title)).map(acc => (
                        <TableRow key={acc._id}>
                            <TableCell className="break-words">
                                {acc.title.split('、').map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        {index == acc.title.split('、').length - 1 ? '' : '、'}
                                        <br />
                                    </span>
                                ))}
                            </TableCell>
                            <TableCell className="truncate">
                                <div className="flex items-center gap-1">
                                    {verified && <ButtonCopy value={acc.username} />}
                                    帳號：{acc.username}
                                </div>
                                <div className="flex items-center mt-2 gap-1">
                                    {verified && <ButtonCopy value={acc.password} />}
                                    密碼：
                                    {verified
                                        ? acc.password.length > 20 ? acc.password.slice(0, 20) + '...' : acc.password
                                        : <TwoFA setVerified={setVerified} Icon={Eye} />
                                    }
                                </div>
                            </TableCell>
                            <TableCell className="text-right sticky right-0 bg-white">
                                {verified
                                    ? <AccountForm type="edit" id={acc._id} />
                                    : <TwoFA setVerified={setVerified} Icon={Pen} />
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default MainTable;