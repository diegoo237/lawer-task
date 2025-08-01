"use client";

import TaskList from "./components/TaskList";

export default function Tasks() {
  return (
    <main className="p-3">
      <div className="grid gap-2">
        <button className="text-md font-semibold justify-self-end py-2 bg-neutral-600 text-white px-4  rounded-lg shadow hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all">
          Criar nova task
        </button>
        <TaskList />
      </div>
    </main>
  );
}
