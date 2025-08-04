import React from "react";
import { Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import {
  deleteFailure,
  deleteStart,
  deleteSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function TodoCard({ todo, statusClass, todos, setTodos }) {
  const [completed, setCompleted] = useState(false);
  const [todoId, setTodoId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    dueDate: new Date(),
  });

  const [updating, setUpdating] = useState(false);
  const dispatch = useDispatch();

  const handleTodoUpdate = async () => {
    try {
      dispatch(updateStart());
      setUpdating(true);
      const res = await fetch(`/api/v1/todo/todos/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        toast.failure(data.message);
        setUpdating(false);
        return;
      } else {
        dispatch(updateSuccess(data.message));
        toast.success(data.message);

        const updatedTodos = todos.map((todo) =>
          todo._id === data.data._id ? data.data : todo
        );
        sessionStorage.clear();
        sessionStorage.setItem("todos", JSON.stringify(updatedTodos));
        console.log("updated", updatedTodos);
        setTodos(updatedTodos);
        setUpdating(false);
        return;
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdating(false);
    }
  };

  const handleTodoDelete = async (todoId) => {
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/v1/todo/todos/${todoId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteFailure(data.message));
        return;
      } else {
        dispatch(deleteSuccess(data.message));
        const updatedTodos = todos.filter((todo) => todo._id !== todoId);
        setTodos(updatedTodos);
        sessionStorage.setItem("todos", JSON.stringify(updatedTodos));
        return;
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const handleUpdateStatus = async (todoId) => {
    try {
      const res = await fetch(`/api/v1/todo/todos/${todoId}`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      } else {
        toast.success(data.message);
        const updated = todos.map((todo) =>
          todo._id === data.data._id ? data.data : todo
        );
        sessionStorage.clear();
        setTodos(updated);
        sessionStorage.setItem("todos", JSON.stringify(updated));
        return;
      }
    } catch (error) {
      toast.error(error.message);
      return;
    }
  };

  return (
    <>
      <div
        className={`relative border shadow rounded-lg p-5 transition transform hover:-translate-y-1
    ${
      todo.status === "completed"
        ? "bg-green-50 border-green-400 hover:shadow-lg"
        : "bg-white border-gray-200 hover:shadow-md"
    }`}
      >
        {/* Icons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            className="text-gray-600 hover:text-purple-600"
            title="Edit"
            onClick={() => {
              setShowUpdateModal((prev) => !prev);
              setTodoId(todo._id);
              setFormData({
                ...formData,
                title: todo.title,
                content: todo.content,
                dueDate: new Date(todo.dueDate),
              });
            }}
          >
            <Pencil size={18} />
          </button>
          <button
            className="text-gray-600 hover:text-red-600"
            title="Delete"
            onClick={() => handleTodoDelete(todo._id)}
          >
            <Trash2 size={18} />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          {todo.title}
        </h2>
        <p className="text-sm text-gray-700 mb-3 break-words whitespace-pre-wrap">
          {todo.content}
        </p>
        <p className="text-sm text-gray-500 mb-3">
          Due:{" "}
          <span className="font-medium">
            {new Date(todo.dueDate).toLocaleString()}
          </span>
        </p>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}
        >
          {todo.status}
        </span>
        <div className="mt-4">
          <input
            type="checkbox"
            name="status"
            id="status"
            checked={todo.status === "completed" ? true : false}
            onChange={(e) => {
              setCompleted((prev) => !prev);
              handleUpdateStatus(todo._id);
            }}
          />
        </div>
      </div>
      {/* update modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-6 text-purple-700">
              Add New Todo
            </h2>

            <form className="flex flex-col gap-5" onSubmit={handleTodoUpdate}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter todo title"
                  className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  placeholder="Details of the task..."
                  className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                  required
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date & Time
                </label>
                <div className="w-full">
                  <DatePicker
                    selected={formData.dueDate}
                    onChange={(date) =>
                      setFormData({ ...formData, dueDate: date })
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="Pp"
                    minDate={new Date()}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="w-full"
                    calendarClassName="custom-datepicker"
                  />
                </div>
              </div>
            </form>
            <div className="flex justify-center gap-4 mt-4">
              <button
                type="submit"
                disabled={updating}
                onClick={() => {
                  handleTodoUpdate();
                  setShowUpdateModal(false);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                {updating ? "Updating" : "Yes, update"}
              </button>
              <button
                onClick={() => setShowUpdateModal((prev) => !prev)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
