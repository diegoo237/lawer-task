"use client";
import { AlertDialog, Flex } from "@radix-ui/themes";
import { apiRequest } from "../../../lib/api";
import { useRouter } from "next/navigation";

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

interface TaskCardProps {
  task: Task;
  deleteTask: (taskId: string) => Promise<void>;
}

export default function TaskCard({ task, deleteTask }: TaskCardProps) {
  const router = useRouter();

  const maxDescriptionLength = 100;
  const truncatedDescription =
    task.description && task.description.length > maxDescriptionLength
      ? `${task.description.substring(0, maxDescriptionLength)}...`
      : task.description;

  const isPastDue = task.dueDate ? new Date(task.dueDate) < new Date() : false;

  const priorityBorderColor =
    {
      baixa: "border-t-green-500",
      média: "border-t-yellow-500",
      alta: "border-t-red-500",
    }[task.priority] || "border-t-gray-300";

  return (
    <div
      className={`flex flex-col p-5 border border-gray-200 rounded-xl shadow-md bg-white  min-h-[150px] border-t-9 ${priorityBorderColor}`}
    >
      <section className="flex items-center justify-between border-b-2 border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {task.title}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => router.push(`/tasks/new?id=${task.id}`)}
            className="cursor-pointer"
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.1464 1.14645C12.3417 0.951184 12.6583 0.951184 12.8535 1.14645L14.8535 3.14645C15.0488 3.34171 15.0488 3.65829 14.8535 3.85355L10.9109 7.79618C10.8349 7.87218 10.7471 7.93543 10.651 7.9835L6.72359 9.94721C6.53109 10.0435 6.29861 10.0057 6.14643 9.85355C5.99425 9.70137 5.95652 9.46889 6.05277 9.27639L8.01648 5.34897C8.06455 5.25283 8.1278 5.16507 8.2038 5.08907L12.1464 1.14645ZM12.5 2.20711L8.91091 5.79618L7.87266 7.87267L8.12731 8.12732L10.2038 7.08907L13.7929 3.5L12.5 2.20711ZM9.99998 2L8.99998 3H4.9C4.47171 3 4.18056 3.00039 3.95552 3.01877C3.73631 3.03668 3.62421 3.06915 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3.06915 3.62421 3.03669 3.73631 3.01878 3.95552C3.00039 4.18056 3 4.47171 3 4.9V11.1C3 11.5283 3.00039 11.8194 3.01878 12.0445C3.03669 12.2637 3.06915 12.3758 3.10899 12.454C3.20487 12.6422 3.35785 12.7951 3.54601 12.891C3.62421 12.9309 3.73631 12.9633 3.95552 12.9812C4.18056 12.9996 4.47171 13 4.9 13H11.1C11.5283 13 11.8194 12.9996 12.0445 12.9812C12.2637 12.9633 12.3758 12.9309 12.454 12.891C12.6422 12.7951 12.7951 12.6422 12.891 12.454C12.9309 12.3758 12.9633 12.2637 12.9812 12.0445C12.9996 11.8194 13 11.5283 13 11.1V6.99998L14 5.99998V11.1V11.1207C14 11.5231 14 11.8553 13.9779 12.1259C13.9549 12.407 13.9057 12.6653 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.6653 13.9057 12.407 13.9549 12.1259 13.9779C11.8553 14 11.5231 14 11.1207 14H11.1H4.9H4.87934C4.47686 14 4.14468 14 3.87409 13.9779C3.59304 13.9549 3.33469 13.9057 3.09202 13.782C2.7157 13.5903 2.40973 13.2843 2.21799 12.908C2.09434 12.6653 2.04506 12.407 2.0221 12.1259C1.99999 11.8553 1.99999 11.5231 2 11.1207V11.1206V11.1V4.9V4.87935V4.87932V4.87931C1.99999 4.47685 1.99999 4.14468 2.0221 3.87409C2.04506 3.59304 2.09434 3.33469 2.21799 3.09202C2.40973 2.71569 2.7157 2.40973 3.09202 2.21799C3.33469 2.09434 3.59304 2.04506 3.87409 2.0221C4.14468 1.99999 4.47685 1.99999 4.87932 2H4.87935H4.9H9.99998Z"
                fill="green"
                strokeWidth="2"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>

          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <button className="cursor-pointer">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                    fill="red"
                    strokeWidth="2"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>Revoke access</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Voce tem certeza ? Esta açao deletara a task: {task.title}{" "}
                permanentemente
              </AlertDialog.Description>

              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <button className="bg-gray-600 p-2 px-4 rounded-2xl cursor-pointer">
                    Cancelar
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <button
                    className="bg-red-500 p-2 px-4 rounded-2xl cursor-pointer"
                    onClick={() => deleteTask(task.id)}
                  >
                    Deletar
                  </button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>

          <button onClick={() => ""} className="cursor-pointer"></button>
        </div>
      </section>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 flex-grow overflow-hidden text-ellipsis">
          {truncatedDescription}
        </p>
      )}

      <div className="mt-auto space-y-1 text-sm text-gray-700">
        <p className="flex items-center">
          <span className="font-medium">Status:</span> {task.status}
          {task.status === "concluída" && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                fill="green"
                stroke="green"
                strokeWidth="2"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          )}
        </p>
        <p>
          <span className="font-medium">Prioridade:</span> {task.priority}
        </p>
        {task.dueDate && (
          <p
            className={
              isPastDue && task.status !== "concluída"
                ? "text-red-600 font-semibold"
                : ""
            }
          >
            <span className="font-medium">Vencimento:</span>{" "}
            {new Date(task.dueDate).toLocaleDateString("pt-BR")}
          </p>
        )}
        {task.cliente && (
          <p>
            <span className="font-medium">Cliente:</span> {task.cliente.name}
          </p>
        )}
      </div>
    </div>
  );
}
