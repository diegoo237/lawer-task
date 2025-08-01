"use client";

import { Flex, TabNav } from "@radix-ui/themes";
import { usePathname } from "next/navigation";
import Link from "next/link"; // Importe o Link do Next.js

export default function Nav() {
  const pathname = usePathname();

  return (
    <main className="bg-neutral-700">
      <Flex justify="center" height="5rem" align="center">
        <TabNav.Root color="indigo" highContrast>
          <TabNav.Link
            asChild
            active={pathname === "/clientes"}
            href={"/clientes"}
          >
            <Link href="/clientes">Clientes</Link>
          </TabNav.Link>
          <TabNav.Link
            asChild
            active={pathname === "/dashboard"}
            href={"/dashboard"}
          >
            <Link href="/dashboard">Dashboard</Link>
          </TabNav.Link>

          <TabNav.Link asChild active={pathname === "/tasks"} href={"/tasks"}>
            <Link href="/tasks">Tasks</Link>
          </TabNav.Link>
        </TabNav.Root>
      </Flex>
    </main>
  );
}
