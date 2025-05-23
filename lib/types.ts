export type TAccount = {
    // Optional, because it is used for creating new records
    _id?: string
    type?: string,
    title: string
    username: string
    password: string
    remark?: string
    label?: string[]
}

export type TNote = {
    title?: string
    context?: string
}

export type TLabel = {
    _id?: string
    key: string
    name: string
}

export type TKeychain = {
    _id?: string
    name: string
    userId: string
}

export type TJWTPayload = {
    userId: string,
    email: string,
    username: string,
    role: "admin" | "user",
    iat: number,
    exp: number
}

export type TNavItem = {
    id: string,
    url: string,
    label: string,
}