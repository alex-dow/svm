"use client";
import { authClient } from "@/lib/auth-client";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Password } from "primereact/password";
import { useState } from "react";
import { newUserNotification } from "@/server/utils/notifications";


export function SignUpForm() {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    const router = useRouter();

    const createAccount = async (username: string, password: string) => {
        setLoading(true);
        const res = await authClient.signUp.email({
            email: `${username}@svm.com`,
            name: username,
            username,
            password
        });
        if (res.error) {
            console.error(res);
            setError(true);
        } else {
            newUserNotification(res.data.user);
            router.push('/');
        }
        setLoading(false);
    }

    return (
        
        <Formik
            initialValues={{ username: '', password: '', confirmPassword: ''}}
            validate={values => {
                const errors: {username?: string, password?: string} = {};
                if (!values.username) {
                    errors.username = 'Required'
                }

                if (!values.password || values.password.length < 8) {
                    errors.password = 'Password is too short';
                } else if (values.password != values.confirmPassword) {
                    errors.password = 'Passwords do not match';
                }

                return errors;
            }}
            onSubmit={(values) => createAccount(values.username, values.password)}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
            }) => (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
                    { error && <Message severity="error" text="Username already exists"/>}
                    <InputText value={values.username} onBlur={handleBlur} onChange={handleChange} placeholder="Username" invalid={touched.username && !!errors.username} name="username" />
                    <Password value={values.password} onBlur={handleBlur} onChange={handleChange} placeholder="Password" toggleMask feedback={false} invalid={touched.password && !!errors.password} name="password" />
                    <Password value={values.confirmPassword} onBlur={handleBlur} onChange={handleChange} placeholder="Re enter password" toggleMask feedback={false} name="confirmPassword" />
                    <Button type="submit" disabled={Object.keys(errors).length > 0 || isSubmitting} severity="info" outlined label="Create Account" />
                </form>
            )}
        </Formik>
    )
}