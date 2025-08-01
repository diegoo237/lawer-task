"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";

import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email,
      senha,
    };

    const response = await apiRequest<{ access_token: string }>(
      "/auth/login",
      "POST",
      data
    );

    if (response.error) {
      return;
      alert("Falha no login");
      alert("Falha no login");
    }

    const token = response.data!.access_token;

    document.cookie = `jwtToken=${token}; path=/; max-age=3600; secure; samesite=lax`;
    alert("Login bem-sucedido!");
    router.push("/dashboard");
  };

  return (
    <div className="font-sans flex items-center justify-center min-h-screen">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <section className="flex flex-col items-center">
          <h1 className=" text-3xl">Bem Vindo de volta</h1>

          <form
            className=" flex flex-col gap-2 p-6  w-80"
            onSubmit={handleSubmit}
          >
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="border-1 border-gray-200  focus:outline-black rounded-2xl p-3"
              type="email"
              placeholder="Email"
            />
            <input
              onChange={(e) => setSenha(e.target.value)}
              className="border-1 border-gray-200  focus:outline-black rounded-2xl p-3"
              type="password"
              placeholder="Senha"
            />
            <button
              type="submit"
              className=" bg-black p-3 rounded-2xl hover:cursor-pointer text-gray-50 font-bold"
            >
              Login
            </button>
            <h2>
              <span>Nao possui conta ainda? </span>
              <Link
                href="/registro"
                className="text-blue-600 hover:cursor-pointer"
              >
                registrar-se
              </Link>
            </h2>
          </form>
        </section>
      </main>
    </div>
  );
}
