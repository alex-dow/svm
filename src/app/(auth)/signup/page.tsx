import { SignUpForm } from "@/components/forms/SignUpForm";

export default function SignupPage() {
    return (
        <div className="flex flex-col items-center self-center gap-4 w-8/12">
        <h1>Create an account for SVM</h1>
        <SignUpForm/>
        </div>
    )
}