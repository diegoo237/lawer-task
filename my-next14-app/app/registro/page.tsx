"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "../lib/api";
import { useState } from "react";

export default function Registro() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email,
      name,
      senha,
    };

    const response = await apiRequest("/cliente", "POST", data);

    if (response.error) {
      return;
    }

    alert("Registro bem-sucedido! Faça login para continuar.");
    router.push("/login");
  };

  return (
    <div className="font-sans flex items-center justify-center min-h-screen">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <section className="flex flex-col items-center ">
          <h1 className=" text-3xl mb-7">Seja bem Vindo</h1>
          <form
            className=" flex flex-col gap-2 p-6  w-80"
            onSubmit={handleSubmit}
          >
            <input
              onChange={(e) => setName(e.target.value)}
              className="border-1 border-gray-200  focus:outline-yellow-500 rounded-2xl p-3"
              type="text"
              placeholder="Usuario"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="border-1 border-gray-200  focus:outline-yellow-500 rounded-2xl p-3"
              type="email"
              placeholder="Email"
            />
            <input
              onChange={(e) => setSenha(e.target.value)}
              className="border-1 border-gray-200  focus:outline-yellow-500 rounded-2xl p-3"
              type="password"
              placeholder="Senha"
            />

            <button
              type="submit"
              className=" bg-black p-3 rounded-2xl hover:cursor-pointer text-gray-50 font-bold"
            >
              Registrar-se
            </button>
            <h2 className="self-center">
              <span>Quer fazer login? </span>
              <Link
                href="/login"
                className="text-blue-600 hover:cursor-pointer"
              >
                Logar
              </Link>
            </h2>
          </form>
        </section>
      </main>
    </div>
  );
}
