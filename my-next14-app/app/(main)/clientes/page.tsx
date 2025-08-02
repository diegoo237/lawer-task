"use client";

import { useEffect, useState } from "react";
import { Table, Text, Flex, Container } from "@radix-ui/themes";
import { apiRequest } from "../../lib/api";

import "@radix-ui/themes/styles.css";

interface Client {
  name: string;
  email: string;
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwtToken="))
          ?.split("=")[1];

        if (!token) {
          setError("Token de autenticação não encontrado.");
          return;
        }

        const response = await apiRequest<Client[]>(
          "/cliente",
          "GET",
          undefined,
          token
        );

        if (response.data) {
          setClients(response.data);
        } else {
          setError("Nenhum dado de clientes retornado.");
        }
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        setError("Falha ao carregar os clientes. Tente novamente mais tarde.");
      }
    };

    fetchClients();
  }, []);

  return (
    <Container size="3" p="3">
      <Flex direction="column" gap="3">
        <Text size="6" weight="bold">
          Lista de Clientes
        </Text>
        {error ? (
          <Text color="red" size="4">
            {error}
          </Text>
        ) : (
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>E-mail</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Data de Criação</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <Table.Row key={client.email}>
                    <Table.Cell>{client.name}</Table.Cell>
                    <Table.Cell>{client.email}</Table.Cell>
                    <Table.Cell>
                      {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={3}>
                    <Text>Nenhum cliente encontrado.</Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        )}
      </Flex>
    </Container>
  );
}
