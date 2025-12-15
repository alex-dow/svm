"use client";
import InputField from "@/components/form/InputField";
import { InputText } from "primereact/inputtext";
import { useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Password } from "primereact/password";
import { ProgressSpinner } from "primereact/progressspinner";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const [busy, setBusy] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setLoginError(null);
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const { data, error } = await authClient.signIn.username({
        username,
        password,
      });
      setBusy(false);

      if (error !== null) {
        setLoginError("Invalid username or password");
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setLoginError("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center ">
      <div className="flex flex-col border-2 border-gray-400 rounded-md p-4 w-1/2 gap-4">
        {verified && (
          <Message
            severity="success"
            text="Your email has been verified. You can now login below."
            id="login-verified-message"
          />
        )}
        {loginError && (
          <Message
            severity="error"
            text={loginError}
            id="login-error-message"
          />
        )}
        <h1 className="text-3xl">Login</h1>
        <form
          id="login-form"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <InputField label="Username" inputId="login-username">
            <InputText id="login-username" autoComplete="off" name="username" />
          </InputField>
          <InputField label="Password" inputId="login-password">
            <Password
              inputId="login-password"
              name="password"
              autoComplete="off"
              feedback={false}
              toggleMask
            />
          </InputField>
          <Button label="Login" type="submit" disabled={busy} id="login-submit" />
          {busy && <ProgressSpinner />}
        </form>
      </div>
    </div>
  );
}
