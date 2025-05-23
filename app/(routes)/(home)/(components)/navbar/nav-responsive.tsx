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
            label: "聯絡我們",
        },
        {
            id: "3",
            url: "/login",
            label: "進入系統",
        },
        // {
        //     id: "4",
        //     url: "#",
        //     label: "Testimonial",
        // },
        // {
        //     id: "5",
        //     url: "#",
        //     label: "Blog",
        // },
        // {
        //     id: "6",
        //     url: "#",
        //     label: "Contact",
        // },
    ]

    return (
        <div>
            <Nav setShowNav={setShowNav} navLinks={navLinks} />
            <NavMobile showNav={showNav} setShowNav={setShowNav} navLinks={navLinks} />
        </div>
    )
}

export default NavResponsive