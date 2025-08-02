"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField, Button, Text, Box, Select, Flex } from "@radix-ui/themes";
import { apiRequest } from "../../../lib/api";
import "@radix-ui/themes/styles.css";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  clientId?: string;
}

interface Client {
  id: string;
  name: string;
}

export default function TaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwtToken="))
          ?.split("=")[1];

        if (!token) {
          router.push("/login");
          return;
        }

        const clientsResponse = await apiRequest<Client[]>(
          "/cliente/",
          "GET",
          null,
          token
        );
        if (clientsResponse.error) {
          console.error("Erro ao buscar clientes:", clientsResponse.error);
          alert(`Erro ao buscar clientes: ${clientsResponse.error}`);
          return;
        }
        setClients(clientsResponse.data || []);

        if (taskId) {
          const response = await apiRequest<Task>(
            `/tasks/${taskId}`,
            "GET",
            null,
            token
          );
          if (response.error) {
            console.error("Erro ao buscar tarefa:", response.error);
            alert(`Erro ao buscar tarefa: ${response.error}`);
            return;
          }
          const task = response.data as Task;
          setTitle(task.title || "");
          setDescription(task.description || "");
          setStatus(task.status || "");
          setPriority(task.priority || "");
          setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
          setSelectedClient(task.clientId || "");
        }
      } catch (error) {
        console.error("Erro inesperado:", error);
        alert("Ocorreu um erro ao buscar os dados.");
      }
    };

    fetchData();
  }, [taskId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !status ||
      !priority ||
      !dueDate ||
      !selectedClient
    ) {
      alert(
        "Por favor, preencha todos os campos obrigatórios, incluindo o cliente."
      );
      return;
    }

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwtToken="))
      ?.split("=")[1];

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const method = taskId ? "PUT" : "POST";
      const endpoint = taskId ? `/tasks/${taskId}` : "/tasks";

      const response = await apiRequest(
        endpoint,
        method,
        taskId
          ? {
              title,
              description,
              status,
              priority,
              dueDate: dueDate ? new Date(dueDate).toISOString() : null,
              clientId: selectedClient,
            }
          : {
              title,
              description,
              status,
              priority,
              dueDate: dueDate ? new Date(dueDate).toISOString() : null,
              id: selectedClient,
            },
        token
      );

      if (response.error) {
        console.error(
          `Erro ao ${taskId ? "atualizar" : "criar"} tarefa:`,
          response.error
        );
        alert(
          `Erro ao ${taskId ? "atualizar" : "criar"} tarefa: ${
            response.error || JSON.stringify(response.error)
          }`
        );
      } else {
        alert(`Tarefa ${taskId ? "atualizada" : "criada"} com sucesso!`);
        router.push("/tasks");
      }
    } catch (error) {
      console.error(
        `Erro inesperado ao ${taskId ? "atualizar" : "criar"} tarefa:`,
        error
      );
      alert(
        `Ocorreu um erro inesperado ao ${
          taskId ? "atualizar" : "criar"
        } a tarefa.`
      );
    }
  };

  return (
    <Box className="max-w-xl mx-auto p-8 rounded-lg shadow-xl bg-neutral-900 text-gray-100 mt-36">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-50">
        {taskId ? "Editar Tarefa" : "Nova Tarefa"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label>
          <Text
            as="div"
            size="2"
            mb="1"
            weight="bold"
            className="text-gray-100"
          >
            Cliente
          </Text>
          <Select.Root
            value={selectedClient}
            onValueChange={setSelectedClient}
            size="3"
            required
          >
            <Select.Trigger
              className="bg-gray-800 text-gray-50 border border-gray-700 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Selecione o Cliente"
            />
            <Select.Content
              position="popper"
              className="bg-gray-800 text-gray-50 border border-gray-700"
            >
              {clients.map((client) => (
                <Select.Item key={client.id} value={client.id}>
                  {client.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </label>

        <label>
          <Text
            as="div"
            size="2"
            mb="1"
            weight="bold"
            className="text-gray-100"
          >
            Título
          </Text>
          <TextField.Root
            placeholder="Título da tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="3"
            color="gray"
            variant="surface"
            className="bg-gray-800 text-gray-50 border border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </label>

        <label>
          <Text
            as="div"
            size="2"
            mb="1"
            weight="bold"
            className="text-gray-100"
          >
            Descrição
          </Text>
          <textarea
            id="description"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-50 border border-gray-700 resize-y"
            required
          />
        </label>
        <Flex gap={"6"}>
          <label>
            <Text
              as="div"
              size="2"
              mb="1"
              weight="bold"
              className="text-gray-100"
            >
              Status
            </Text>
            <Select.Root
              value={status}
              onValueChange={setStatus}
              size="3"
              required
            >
              <Select.Trigger
                className="bg-gray-800 text-gray-50 border border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Selecione o Status"
              />
              <Select.Content
                position="popper"
                className="bg-gray-800 text-gray-50 border border-gray-700"
              >
                <Select.Item value="pendente">Pendente</Select.Item>
                <Select.Item value="em progresso">Em Progresso</Select.Item>
                <Select.Item value="concluída">Concluída</Select.Item>
              </Select.Content>
            </Select.Root>
          </label>
          <label>
            <Text
              as="div"
              size="2"
              mb="1"
              weight="bold"
              className="text-gray-100"
            >
              Prioridade
            </Text>
            <Select.Root
              value={priority}
              onValueChange={setPriority}
              size="3"
              required
            >
              <Select.Trigger
                className="bg-gray-800 text-gray-50 border border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Selecione a Prioridade"
              />
              <Select.Content
                position="popper"
                className="bg-gray-800 text-gray-50 border border-gray-700"
              >
                <Select.Item value="baixa">Baixa</Select.Item>
                <Select.Item value="média">Média</Select.Item>
                <Select.Item value="alta">Alta</Select.Item>
              </Select.Content>
            </Select.Root>
          </label>
        </Flex>

        <label>
          <Text
            as="div"
            size="2"
            mb="1"
            weight="bold"
            className="text-gray-100"
          >
            Data de Entrega
          </Text>
          <TextField.Root
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            size="3"
            color="gray"
            variant="surface"
            className="bg-gray-800 text-gray-50 border border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </label>

        <Button
          mt="5"
          type="submit"
          size="3"
          variant="solid"
          className="bg-violet-600 hover:bg-violet-700 text-white w-full mt-6"
        >
          Salvar Tarefa
        </Button>
      </form>
    </Box>
  );
}
