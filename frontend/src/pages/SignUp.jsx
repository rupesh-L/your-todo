import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import { toast } from "react-toastify";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const res = await fetch("/api/v1/user/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setError(null);
        toast.success(data.message);
        setSuccess(data.message);
        setLoading(false);
        setFormData({ username: "", email: "", password: "" });
        navigate("/sign-in");
        return;
      } else {
        toast.error(data.message);
        setError(data.message);
        setSuccess(null);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setError(error.message);
      setLoading(false);
      setSuccess(null);
      return;
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-md">
        <h1 className="text-4xl sm:text-6xl font-bold text-center text-purple-700 mb-8">
          Sign Up
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            Create Account
          </button>
        </form>
        <div className="flex gap-4 mt-4">
          <p>Already have an account ?</p>
          <span className="text-purple-700">
            <Link to={"/sign-in"} element={<SignIn />}>
              Sign In
            </Link>
          </span>
        </div>
        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-300 px-4 py-2 rounded-md shadow-sm">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
