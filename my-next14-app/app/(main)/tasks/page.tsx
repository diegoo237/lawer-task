"use client";

import TaskList from "./components/TaskList";
import { useRouter } from "next/navigation";

export default function Tasks() {
  const router = useRouter();

  return (
    <main className="p-3">
      <div className="grid gap-4">
        <div className="flex justify-end">
          <button
            onClick={() => router.push("/tasks/new")}
            className="text-md font-semibold py-2 bg-neutral-600 text-white px-4 rounded-lg shadow hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          >
            Criar nova task
          </button>
        </div>

        <TaskList />
      </div>
    </main>
  );
}
