"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

export default function GuestHome() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      In order to use this application, you will need to login or create an
      account.
      <Button label="Login" onClick={() => router.push("/login")} />
      <Button label="Signup" onClick={() => router.push("/signup")} />
    </div>
  );
}
