"use client";

import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import Link from "next/link";
import { TaskDetailContent } from "./detail-content";

const TaskDetailPage: NextPage = () => {
  const searchParams = useSearchParams();
  const id = z.string().parse(searchParams.get("id"));

  return (
    <>
      <h1 className="ml-1 text-sm">
        <Link
          href="/todo-2"
          className="rounded px-2 py-1 transition-colors hover:bg-zinc-700"
        >
          home
        </Link>
        <span className="mx-1">/</span>
        <span className="rounded p-1 px-2">{id}</span>
      </h1>

      <TaskDetailContent taskId={id} />
    </>
  );
};

export default TaskDetailPage;
