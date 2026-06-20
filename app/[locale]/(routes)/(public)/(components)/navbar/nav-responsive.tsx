"use client"

import { useState } from 'react'

import Nav from './nav'
import NavMobile from './nav-mobile'
import { TNavItem } from '@/lib/types'

const NavResponsive = () => {
    const [showNav, setShowNav] = useState(false)
    
    const navLinks: TNavItem[] = [
        {
            id: "1",
            url: "/",
            label: "首頁",
        },
        {
            id: "2",
            url: "/contact",
            label: "聯絡",
        },
        {
            id: "3",
            url: "/pricing",
            label: "方案",
        },
        {
            id: "4",
            url: "/login",
            label: "進入系統",
        },
    ]

    return (
        <div className='relative mb-[12vh]'>
            <Nav setShowNav={setShowNav} navLinks={navLinks} />
            <NavMobile showNav={showNav} setShowNav={setShowNav} navLinks={navLinks} />
        </div>
    )
}

export default NavResponsive