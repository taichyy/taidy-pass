"use client"
import AOS from 'aos'
import "aos/dist/aos.css"
import { useEffect } from 'react'

type Props = {
    children: React.ReactNode,
}

const ProviderAOS = ({children}: Props) => {
    useEffect(() => {
        const initAOS = async () => {
            await import("aos")
            AOS.init({
                duration: 1000,
                easing: "ease",
                once: true,
                anchorPlacement: "top-bottom"
            })
        }
        
        initAOS()
    }, [])

    return (
        <>
            {children}
        </>
    )
}

export default ProviderAOS