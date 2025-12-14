import GuestHome from "@/components/homePage/GuestHome";
import UserHome from "@/components/homePage/UserHome";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    return <UserHome user={session.user} />;
  } else {
    return <GuestHome />;
  }
}
