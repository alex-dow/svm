"use server";

import { User } from "better-auth";
import ProjectsList from "../projects/ProjectsList";
import { getProjectsAction } from "@/lib/actions/projects";

export default async function UserHome({ user }: { user: User }) {
  return (
    <div>
      <h1>Welcome back {user.name}!</h1>
      <ul>
        <li>
          <a href="/projects">Projects</a>
        </li>
      </ul>
    </div>
  );
}
