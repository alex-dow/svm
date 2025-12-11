"use client";

import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export interface AppAvatarProps {
  username?: string;
}

export default function AppAvatar({ username }: AppAvatarProps) {
  const router = useRouter();
  const menu = useRef<Menu>(null);
  const toast = useRef<Toast>(null);

  let items: MenuItem[] = [];
  if (username) {
    items.push({
      label: username,
      items: [
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: async () => {
            try {
              const { error } = await authClient.signOut();
              if (error) {
                throw error;
              }
              window.location.reload();
            } catch (err) {
              toast.current!.show({
                severity: "error",
                summary: "Error",
                detail:
                  "An error occurred when trying to logout. You should reload this page.",
              });
            }
          },
        },
      ],
    });
  } else {
    items.push({
      label: "Login",
      icon: "pi pi-sign-in",
      command: () => {
        router.push("/login");
      },
    });
    items.push({
      label: "Signup",
      icon: "pi pi-user-plus",
      command: () => {
        router.push("/signup");
      },
    });
  }

  return (
    <>
      <Toast ref={toast} />
      <Menu ref={menu} model={items} popup id="app-avatar-menu" />
      <Avatar
        icon="pi pi-user"
        shape="circle"
        id="app-avatar"
        onClick={(event) => menu.current!.toggle(event)}
        aria-controls="app-avatar-menu"
        aria-haspopup="true"
      />
    </>
  );
}
