"use client";
import { apiRequest } from "@/app/lib/api";
import { Box, Card, Flex, Text, Heading, Separator } from "@radix-ui/themes";
import { useState, useEffect } from "react";

type TaskStatus = "pendente" | "em progresso" | "concluída";
type TaskPriority = "alta" | "média" | "baixa";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  clientId: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface DashboardStats {
  todoCount: number;
  doingCount: number;
  doneCount: number;
  clientesCount: number;
  priorityCounts: {
    alta: number;
    média: number;
    baixa: number;
  };
  tasksDueSoon: number;
  tasksPerClient: {
    [clientId: string]: number;
  };
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwtToken="))
      ?.split("=")[1];

    if (!token) {
      console.error("Token JWT não encontrado.");
      setLoading(false);
      return;
    }

    const fetchClients = async () => {
      try {
        const response = await apiRequest<Client[]>(
          "/cliente",
          "GET",
          undefined,
          token
        );
        setClientes(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        setClientes([]);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await apiRequest<Task[]>(
          "/tasks",
          "GET",
          undefined,
          token
        );
        setTasks(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar tarefas:", err);
        setTasks([]);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchClients()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || clientes.length > 0) {
      const todoCount = tasks.filter(
        (task) => task.status === "pendente"
      ).length;
      const doingCount = tasks.filter(
        (task) => task.status === "em progresso"
      ).length;
      const doneCount = tasks.filter(
        (task) => task.status === "concluída"
      ).length;
      const clientesCount = clientes.length;

      const priorityCounts = tasks.reduce(
        (acc, task) => {
          acc[task.priority] = (acc[task.priority] || 0) + 1;
          return acc;
        },
        { alta: 0, média: 0, baixa: 0 }
      );

      // Contagem de tarefas com vencimento próximo (próximos 7 dias)
      const now = new Date();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(now.getDate() + 7);

      const tasksDueSoon = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate > now && dueDate <= oneWeekFromNow;
      }).length;

      // Contagem de tarefas por cliente
      const tasksPerClient = tasks.reduce((acc, task) => {
        acc[task.clientId] = (acc[task.clientId] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      setStats({
        todoCount,
        doingCount,
        doneCount,
        clientesCount,
        priorityCounts,
        tasksDueSoon,
        tasksPerClient,
      });
    }
  }, [tasks, clientes]); // Recalcula quando as tarefas ou clientes mudam

  if (loading) {
    return (
      <Box p="4" style={{ textAlign: "center" }}>
        <Text as="div" size="5" weight="bold">
          Carregando...
        </Text>
      </Box>
    );
  }

  // Verifica se as estatísticas foram calculadas
  if (!stats) {
    return (
      <Box p="4" style={{ textAlign: "center" }}>
        <Text as="div" size="5" weight="bold">
          Não foi possível carregar os dados do dashboard.
        </Text>
      </Box>
    );
  }

  const findClientName = (clientId: string) => {
    const client = clientes.find((c) => c.id === clientId);
    return client ? client.name : "Cliente Desconhecido";
  };

  return (
    <Box mt={"6"} p="4">
      <Flex gap="3" wrap="wrap" justify="center">
        <Card size="2" style={{ minWidth: 200 }}>
          <Text as="div" size="2" weight="bold">
            Tarefas Pendentes
          </Text>
          <Text as="div" size="6">
            {stats.todoCount}
          </Text>
        </Card>
        <Card size="2" style={{ minWidth: 200 }}>
          <Text as="div" size="2" weight="bold">
            Tarefas em Progresso
          </Text>
          <Text as="div" size="6">
            {stats.doingCount}
          </Text>
        </Card>
        <Card size="2" style={{ minWidth: 200 }}>
          <Text as="div" size="2" weight="bold">
            Tarefas Concluídas
          </Text>
          <Text as="div" size="6">
            {stats.doneCount}
          </Text>
        </Card>
        <Card size="2" style={{ minWidth: 200 }}>
          <Text as="div" size="2" weight="bold">
            Clientes
          </Text>
          <Text as="div" size="6">
            {stats.clientesCount}
          </Text>
        </Card>
      </Flex>
      <Separator size="4" my="5" />
      <Flex gap="3" wrap="wrap" justify="center">
        <Card size="2" style={{ minWidth: 200 }}>
          <Text as="div" size="2" weight="bold">
            Tarefas por prioridade
          </Text>
          <Text as="div" size="3">
            Alta: {stats.priorityCounts.alta}
          </Text>
          <Text as="div" size="3">
            Média: {stats.priorityCounts.média}
          </Text>
          <Text as="div" size="3">
            Baixa: {stats.priorityCounts.baixa}
          </Text>
        </Card>
        <Card size="2" style={{ minWidth: 200 }}>
          <Text as="div" size="2" weight="bold">
            Tarefas a Vencer (7d)
          </Text>
          <Text as="div" size="6">
            {stats.tasksDueSoon}
          </Text>
        </Card>
      </Flex>
      <Separator size="4" my="5" />

      <Flex
        gap="3"
        wrap="wrap"
        direction={"column"}
        justify={"center"}
        align={"center"}
      >
        <Heading size="5" mb="3">
          Tarefas por Cliente
        </Heading>
        <Flex gap="3">
          {Object.keys(stats.tasksPerClient).map((clientId) => (
            <Card key={clientId} size="1" style={{ minWidth: 150 }}>
              <Text as="div" size="2" weight="bold">
                {findClientName(clientId)}
              </Text>
              <Text as="div" size="4">
                {stats.tasksPerClient[clientId]} tarefas
              </Text>
            </Card>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
}
