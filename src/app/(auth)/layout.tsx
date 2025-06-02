export default function AuthLayout({children}: { children: React.ReactNode}) {
    return <>
    <div className="flex flex-1 w-full items-center justify-center">{children}
        </div>
        </>
}