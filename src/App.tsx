import axios from "axios";
import { useEffect, useState } from "react";

type TodoView = { user: number, id: number, title: string, completed: boolean };
const Todo_IDS = [1, 2, 3, 4, 5];

function App() {
  const [currentTodoId, setCurrentTodoId] = useState(1);

  return (
    <div>
      <div className="flex gap-2">
        {Todo_IDS.map((id) => (
          <button key={id} onClick={() => setCurrentTodoId(id)}> {id} </button>
        ))}
      </div>
      <TodoView id={currentTodoId} />
    </div>
  )
}
type TodoViewProps = { id: number };
function TodoView({ id }: TodoViewProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState<string | null>(null);


  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    axios.get<TodoView>(`https://jsonplaceholder.typicode.com/todos/${id}`, { signal: controller.signal })
      .then((response) => setTitle(response.data.title))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError("failed to load todo");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      })

    return () => controller.abort();
  }, [id]);

  if (loading) return <p>loading.....</p>;
  if (Error) return <p>{Error}</p>;
  return <p>{title}</p>;

}

export default App