"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../../lib/api";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  cliente: {
    id: string;
    email: string;
    name: string;
  };
}

export default function TaskList() {
  const deleteTask = async (taskId: string) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwtToken="))
        ?.split("=")[1];

      if (!token) {
        router.push("/login");
        return;
      }

      await apiRequest(`/tasks/${taskId}`, "DELETE", null, token);

      setTasks(tasks.filter((t) => t.id !== taskId));
      console.log("Tarefa deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao executar deleteTask:", error);
    }
  };

  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwtToken="))
        ?.split("=")[1];

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await apiRequest<Task[]>(
        "/tasks",
        "GET",
        undefined,
        token
      );

      if (response.error) {
        if (response.error.includes("Não autorizado")) {
          document.cookie = "jwtToken=; path=/; max-age=0";
          router.push("/login");
        }
      } else {
        setTasks(response.data!);
      }
    };

    fetchTasks();
  }, [router]);

  return (
    <div className="h-screen w-full  p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Tarefas</h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} deleteTask={deleteTask} />
        ))}
      </div>
    </div>
  );
}
