import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center self-center gap-4 w-8/12">
            <h1 className="font-mono text-3xl text-red-400 font-bold">AUTHORIZED PERSONNEL ONLY</h1>

            <div className="border-8 border-danger-tape p-4 bg-slate-950 flex-1 w-3/4">
                <LoginForm/>
            </div>

        </div>
    )
}