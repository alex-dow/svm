'use client';
import Link from "next/link";
import './NavLink.css';
import { usePathname } from "next/navigation";

export default function NavLink({href, children, className}: {href: string, children?: React.ReactNode, className?: string}) {

    const pathname = usePathname();

    return (
        <Link href={href} className={ className + ' ' + (pathname === href ? 'nav-link active' : 'nav-link')}>
            {children}
        </Link>
    )
}