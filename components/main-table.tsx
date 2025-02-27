"use client"
import { Eye, Pen } from "lucide-react"
import { useEffect, useState } from "react"

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

export const dynamic = 'force-dynamic'

type TAccount = {
    _id: string
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
            if (search === '') {
                setFiltered(accounts);
            } else {
                setFiltered(accounts.filter(record =>
                    record.title.toLowerCase().includes(search.toLowerCase()) ||
                    record.username.toLowerCase().includes(search.toLowerCase())
                ));
            }
        }
    }, [accounts, search]);

    return (
        <div>
            <Input defaultValue={search} onChange={(e) => (setSearch(e.target.value))} />
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