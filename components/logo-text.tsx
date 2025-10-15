import Link from "next/link"
import Image from "next/image"

const LogoText = () => {
    return (
        <Link href="/" className="flex items-center ">
            <Image
                src="/logo.png"
                alt="TaidyPass logo."
                width={65}
                height={65}
            />
            <h1 className="text-xl md:text-3xl font-semibold">
                <span className="text-primary mr-0.5">Taidy</span>
                <span className="dark:text-primary">Pass</span>
            </h1>
        </Link>
    );
}

export default LogoText;