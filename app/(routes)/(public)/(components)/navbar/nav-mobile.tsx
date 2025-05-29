import Link from 'next/link'
import { CgClose } from 'react-icons/cg'

import { TNavItem } from '@/lib/types';

type Props = {
    showNav: boolean;
    navLinks: TNavItem[]
    setShowNav: (showNav: boolean) => void;
}

const NavMobile = ({
    showNav, 
    navLinks, 
    setShowNav
}: Props) => {
    const navOpen = showNav ? "translate-x-0" : "-translate-x-full"
    
    return (
        <div>
            {/* Overlay */}
            <div 
                onClick={() => setShowNav(false)}
                className={`fixed ${navOpen} inset-0 transform transition-all duration-500 z-[10000] bg-black opacity-70 w-full h-screen`} 
            />
            {/* Nav links */}
            <div className={`text-white ${navOpen} fixed inset-0 justify-center flex flex-col h-full transform transition-all duration-500 delay-300 w-[80%] sm:w-[60%] bg-sky-700 space-y-6 z-[10006]`}>
                {navLinks.map((link) => (
                    <Link 
                        key={link.id} 
                        href={link.url} 
                        onClick={() => setShowNav(false)}
                    >
                        <p className=" nav_link text-white text-[20px] ml-12 border-b-[1.5px] pb-1 border-white sm:text-[24px]">
                            {link.label}
                        </p>
                    </Link>
                ))}
                {/* Close Icon */}
                <CgClose 
                    onClick={() => setShowNav(false)} 
                    className="cursor-pointer absolute top-[0.7rem] right-[1.4rem] sm:w-8 sm:h-8 w-6 h-6" 
                />
            </div>
        </div>
    )
}

export default NavMobile