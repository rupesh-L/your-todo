import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AddToDo() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    dueDate: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((store) => store.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/v1/todo/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        setError(data.message);
        setSuccess(null);
        setLoading(false);
        return;
      } else {
        sessionStorage.clear();
        toast.success(data.message);
        setError(null);
        setSuccess(data.message);
        setLoading(false);
        setFormData({
          title: "",
          content: "",
          dueDate: new Date(),
        });
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
      setError(error);
      setSuccess(null);
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <Navigate to={"/sign-in"} />;
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 max-w-xl mx-auto mt-12 bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-purple-700">Add New Todo</h2>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
              onChange={(date) => setFormData({ ...formData, dueDate: date })}
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

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          {loading ? "Adding..." : "Add Todo"}
        </button>
      </form>
    </div>
  );
}
