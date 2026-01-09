"use server";

import { User } from "better-auth";
import ProjectsList from "../projects/ProjectsList";
import { getProjectsAction } from "@/lib/actions/projects";
import Link from "next/link";

export default async function UserHome({ user }: { user: User }) {
  return (
    <div className="flex flex-col p-4 flex-1 gap-4">
      
      <h1 className="text-5xl text-center rounded-2xl bg-orange-500/25 p-4">Welcome back {user.name}!</h1>
      
      <div className="flex gap-4 h-1/2">
        <Link className="flex flex-1 rounded-2xl bg-orange-800 flex-col justify-center items-center text-7xl cursor-pointer" href="/projects">
          PROJECTS
        </Link>
        <a href="https://github.com/alex-dow/svm" target="_blank" className="flex flex-1 rounded-2xl bg-orange-800 flex-col justify-center items-center text-7xl cursor-pointer">
          SVM INFO
        </a>
      </div>

    </div>
  );
}
