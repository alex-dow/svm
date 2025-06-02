'use client';
import Link from "next/link";
import './NavLink.css';
import { usePathname } from "next/navigation";

export default function NavLink({href, children}: {href: string, children?: React.ReactNode}) {

    const pathname = usePathname();

    return (
        <Link href={href} className={ pathname === href ? 'nav-link active' : 'nav-link'}>
            {children}
        </Link>
    )
}