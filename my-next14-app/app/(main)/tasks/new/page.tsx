import { Suspense } from "react";
import TaskForm from "./components/TaskForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando formulário...</div>}>
      <TaskForm />
    </Suspense>
  );
}
