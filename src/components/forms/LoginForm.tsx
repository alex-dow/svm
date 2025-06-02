"use client";

import { authClient } from "@/lib/auth-client";
import { redirect, RedirectType } from "next/navigation";
import { useState } from "react";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useRouter } from "next/navigation";

import './LoginForm.css';

export default function LoginForm() {

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setError(false);
        setLoading(true);
        e.preventDefault();
        const res = await authClient.signIn.username({
            username,
            password
        });
        if (res.error) {
            console.error(res);
            setError(true);
            setLoading(false);
        } else {
            redirect('/', RedirectType.replace);
        }
        
    }
    return (
        <>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
            { error && <Message severity="error" text="Invalid username or password"/>}
            { error && <p>Invalid username or password </p>}
            <InputText value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <Password 
                className="w-full pw-fix"
                inputClassName="w-full"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                toggleMask 
                feedback={false}
                pt={{

                    iconField:{
                        className: 'flex flex-1 w-full'
                    }
                }}
            />
            
            <Button type="submit" disabled={loading} severity="info" outlined label="Sign In"/>
        </form>
        <div className="text-center mt-4">
            <p className="mb-4">Are you a new employee ready to get started entering in data? Then press the button below to launch the new employeee workflow!</p>
            <Button severity="warning" className="text-2xl font-bold font-mono" icon="pi pi-user" onClick={() => router.push('/signup')}>
                NEW EMPLOYEE REGISTRATION
            </Button>
        </div>
        </>
    )
}