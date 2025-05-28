"use client"
import useSWR from "swr"
import { useEffect, useState } from "react"
import { HiQuestionMarkCircle } from "react-icons/hi2"
import { ChevronsUpDown, Edit, Eye, EyeOff, Key, Pencil, PlusCircle } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import LabelsSelector from "./labels-selector"
import { Button } from "@/components/ui/button"
import { AESDecrypt, poster } from "@/lib/utils"
import DialogShare from "./(dialogs)/dialog-share"
import { useHideStore } from "@/lib/stores/use-hide"
import DialogAccount from "./(dialogs)/dialog-account"
import DialogKeyChain from "./(dialogs)/dialog-keychain"
import { TAccount, TKeychain, TLabel } from "@/lib/types"
import ButtonCopy from "@/components/buttons/button-copy"
import { useKey } from "@/components/providers/provider-key"
import ButtonLogout from "@/components/buttons/button-logout"
import { ThemeModeToggle } from "@/components/theme-mode-toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type TAPIKeychain = {
    status: boolean,
    message: string,
    type?: string,
    data: TKeychain[]
}
type TAPIAccounts = {
    status: boolean,
    message: string,
    type?: string,
    data: TAccount[]
}

const Icon = ({
    hide,
    onClick,
    className,
}: {
    hide: boolean,
    onClick: () => void,
    className?: string
}) => {
    const props = {
        onClick,
        className,
    }

    return (
        hide
            ? <Eye {...props} />
            : <EyeOff {...props} />
    )
}

// This is not the main, but a sub-component, main below.
const CollapsibleArea = ({
    keychainId,
    keychainName,
    labels,
    hide,
    search,
    searchKeys,
}: {
    keychainId?: string,
    keychainName?: string,
    labels: TLabel[],
    hide: boolean,
    search: string,
    searchKeys: string[],
}) => {
    const { key } = useKey()

    const [accounts, setAccounts] = useState<TAccount[]>([])
    const [open, setOpen] = useState(!keychainId)
    const [filtered, setFiltered] = useState<TAccount[]>([])
    const [allUsedLabels, setAllUsedLabels] = useState<string[]>([])

    const paramsAcc = { method: "get" }
    const bodyAcc: any = { labels: searchKeys }
    if (keychainId) {
        bodyAcc.keychainId = keychainId
    }
    const { data: fetched, error, isLoading, mutate } = useSWR<TAPIAccounts>(
        ["/api/accounts", paramsAcc, bodyAcc],
        ([url, params, body]) => poster(url, params, body),
    )
    const encryptedAccounts = fetched?.data

    useEffect(() => {
        accounts && setFiltered(accounts.filter(record =>
            (record.title.toLowerCase().includes(search.toLowerCase()) || record.username.toLowerCase().includes(search.toLowerCase()))
        ))
    }, [search])

    useEffect(() => {
        if (!fetched?.data || !key) return;

        const decrypted = fetched.data.map((record) => ({
            ...record,
            title: AESDecrypt(record.title, key),
            username: AESDecrypt(record.username, key),
            password: AESDecrypt(record.password, key),
            remark: record.remark ? AESDecrypt(record.remark, key) : "",
        }))?.sort((a, b) => a.title.localeCompare(b.title))

        const usedLabels = Array.from(new Set(decrypted.map(record => record.label).flat())) as string[];

        setAccounts(decrypted)
        setFiltered(decrypted)
        setAllUsedLabels(usedLabels)
    }, [encryptedAccounts, key])

    useEffect(() => {
        mutate()
    }, [searchKeys])

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            className="w-full space-y-2 mt-2"
        >
            <div className="flex items-center justify-between w-fit">
                <Tooltip>
                    <TooltipTrigger>
                        {keychainId ? (
                            <Badge className="mr-2 mb-1" variant="outline">
                                自訂
                            </Badge>
                        ) : (
                            <HiQuestionMarkCircle
                                size={24}
                                className="pb-1 cursor-pointer"
                            />
                        )}
                    </TooltipTrigger>
                    {keychainId ? (
                        <TooltipContent>
                            自訂鑰匙圈會以您生成的金鑰進行加密。
                            <br />
                            如果您遺失金鑰，包括我們，都將無法為您找回資料。
                        </TooltipContent>
                    ) : (
                        <TooltipContent>
                            預設鑰匙圈會以您的登入密碼、伺服器金鑰進行雙重加密。
                            <br />
                            如果您重設密碼，預設鑰匙圈的內容將會被清空。
                        </TooltipContent>
                    )}
                </Tooltip>
                <h4 className="font-semibold">
                    {keychainName || "預設鑰匙圈"}
                </h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
                {allUsedLabels?.join("、") || "無標籤"}
            </div>
            <CollapsibleContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4">
                {!!filtered?.length && filtered.map(item => (
                    <Card key={item._id} className="mt-4 py-4 px-3 flex flex-col justify-end">
                        <div className="flex flex-wrap gap-1 pb-2">
                            {item?.label && item.label.length > 0 && item.label.map((label, index) => (
                                <Badge key={index} variant="outline" className="text-sm text-primary bg-orange-50">
                                    {label}
                                </Badge>
                            ))}
                        </div>
                        <div>
                            <div className="pl-2 text-base">
                                {item.title}
                                <div className="flex justify-between flex-col flex-wrap mt-2">
                                    <div className="flex items-center gap-1 flex-1">
                                        <Key size={16} />
                                        <span className=" min-w-[60px] md:min-w-[90px] lg:min-w-[120px]">
                                            {!hide ? item.username : item.username.replace(/./g, "*")}
                                        </span>
                                        {!hide && <ButtonCopy value={item.username} className="ml-auto" />}
                                    </div>
                                    <div className="flex items-center gap-1 flex-1">
                                        <Key size={16} />
                                        <span className=" min-w-[60px] md:min-w-[90px] lg:min-w-[120px]">
                                            {!hide
                                                ? item.password.length > 20 ? item.password.slice(0, 20) + '...' : item.password
                                                : item.password.length > 20 ? item.password.replace(/./g, "*").slice(0, 20) + '...' : item.password.replace(/./g, "*")
                                            }
                                        </span>
                                        {!hide && <ButtonCopy value={item.password} className="ml-auto" />}
                                    </div>
                                    {/* 第二行：備註 */}
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className="flex items-center gap-1">
                                                <Pencil size={16} />
                                                {!hide
                                                    ? item.remark && (item.remark.length > 20 ? item.remark.slice(0, 20) + '...' : item.remark)
                                                    : item.remark && (item.remark.length > 20 ? item.remark.replace(/./g, "*").slice(0, 20) + '...' : item.remark.replace(/./g, "*"))
                                                }
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {item.remark}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="flex gap-1 justify-end mt-3">
                                {/* This is a dialog, which display only the button. */}
                                <DialogAccount
                                    labels={labels}
                                    mutate={mutate}
                                    id={item._id}
                                >
                                    <Edit size={20} className="text-slate-600 cursor-pointer" />
                                </DialogAccount>
                                <DialogShare />
                            </div>
                        </div>
                    </Card>
                ))}
                <DialogAccount
                    mutate={mutate}
                    labels={labels}
                    keychainId={keychainId}
                >
                    <Card className="mt-4 py-4 px-3 min-h-[200px] cursor-pointer flex justify-center items-center opacity-50 hover:opacity-100 transition-opacity duration-300 bg-transparent hover:bg-white/40">
                        <PlusCircle
                            size={32}
                            className="text-slate-700 cursor-pointer"
                        />
                    </Card>
                </DialogAccount>
            </CollapsibleContent>
            {!isLoading && !(filtered.length) && open && (
                <div className="flex justify-center items-center mt-20">
                    暫無紀錄，
                    點擊上方<PlusCircle className="mx-2 hidden sm:inline" />新增一筆
                </div>
            )}
        </Collapsible>
    )
}

const TableMain = ({
    labels,
    children,
}: {
    labels: TLabel[],
    children?: React.ReactNode
}) => {
    const { hide, setHide } = useHideStore()

    const [search, setSearch] = useState("")
    const [searchKeys, setSearchKeys] = useState<string[]>([])

    const paramsKeychain = { method: "get" }
    const bodyKeychain = {}
    const { data: fetched, isLoading, mutate } = useSWR<TAPIKeychain>(
        ["/api/keychains", paramsKeychain, bodyKeychain],
        ([url, params, body]) => poster(url, params, body),
    )
    const keychains = fetched?.data

    return (
        <div>
            {/* Top tool bar */}
            <nav className="flex justify-between mb-4 flex-wrap gap-4 ">
                <div className=" flex justify-center items-center gap-2">
                    <Icon
                        hide={hide}
                        onClick={() => setHide(!hide)}
                        className="cursor-pointer"
                    />
                    {/* Use children here is kinda weird, this is mainly for keeping the children server component. */}
                    {children}
                    <DialogKeyChain mutate={mutate} />
                </div>
                <div className="flex gap-2 ml-auto">
                    <ThemeModeToggle />
                    <ButtonLogout />
                </div>
            </nav>
            {/* Filter keys */}
            <LabelsSelector
                labels={labels}
                value={searchKeys}
                setValue={setSearchKeys}
            />
            <Input
                defaultValue={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                }}
                placeholder="搜尋......"
                className="h-[50px] text-base"
            />
            {/* Main area, under search and filtering section. */}
            {/* First one, without keychainId, means default keychain */}
            {!isLoading && (
                <main className="my-4 flex flex-col gap-4">
                    <CollapsibleArea
                        labels={labels}
                        hide={hide}
                        search={search}
                        searchKeys={searchKeys}
                    />
                    {/* All the other conditional rendering keychains */}
                    {keychains && keychains.length > 0 && keychains.map((keychain) => (
                        <CollapsibleArea
                            key={keychain._id}
                            keychainId={keychain._id}
                            keychainName={keychain.name}
                            labels={labels}
                            hide={hide}
                            search={search}
                            searchKeys={searchKeys}
                        />
                    ))}
                </main>
            )}
        </div>
    );
}

export default TableMain;