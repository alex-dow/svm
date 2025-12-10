"use client";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  return (
    <div>
      <h1>Login</h1>
      {verified && <div>Email verified</div>}
    </div>
  );
}
