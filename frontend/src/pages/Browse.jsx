import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import TodoCard from "../components/TodoCard";
import { toast } from "react-toastify";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
};

export default function Browse() {
  const { currentUser } = useSelector((store) => store.user);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const cachedTodos = sessionStorage.getItem("todos");
    if (cachedTodos) {
      setTodos(JSON.parse(cachedTodos));
      setLoading(false);
      if (JSON.parse(cachedTodos).length < 3) {
        setShowMore(false);
      }
      return;
    }

    const fetchTodos = async () => {
      try {
        const res = await fetch("/api/v1/todo/todos");
        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
          toast.error(data.message);
          return;
        } else {
          setTodos(data.data);
          sessionStorage.setItem("todos", JSON.stringify(data.data));
          if (data.data.length < 3) {
            setShowMore(false);
          }
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchTodos();
  }, []);

  const handleShowMore = async () => {
    try {
      const res = await fetch(`/api/v1/todo/todos?skip=${todos.length}`);
      const data = await res.json();
      if (!res.ok) {
        console.log("Error fetching more todos");
      } else {
        setTodos((prev) => {
          const updated = [...prev, ...data.data];
          sessionStorage.setItem("todos", JSON.stringify(updated));
          return updated;
        });

        if (data.data.length < 3) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Todos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {todos.map((todo) => {
          const statusClass =
            statusColors[todo.status] || "bg-gray-100 text-gray-800";
          return (
            <TodoCard
              todo={todo}
              key={todo._id}
              statusClass={statusClass}
              todos={todos}
              setTodos={setTodos}
            />
          );
        })}
      </div>

      <div className="flex justify-between my-6">
        <Link to="/add-todo">
          <button className="px-5 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition">
            ➕ Add Todo
          </button>
        </Link>
        {showMore && (
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition"
            onClick={handleShowMore}
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}
