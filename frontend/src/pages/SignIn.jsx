import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SignUp from "./SignUp";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { toast } from "react-toastify";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((store) => store.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/v1/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setError(data.message);
        toast.error(data.message);
        setLoading(false);
        return;
      }

      dispatch(signInSuccess(data.user));
      toast.success(data.message);
      setLoading(false);
      navigate(`/browse/${data.user._id}`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
      setLoading(false);
      setError(error);
    } finally {
      setFormData({ email: "", password: "" });
    }
  };

  if (currentUser) {
    return <Navigate to={`/browse/${currentUser._id}`} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl sm:text-6xl font-bold text-center text-purple-700 mb-8">
          Sign In
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>

        <div className="flex gap-4 mt-4 text-sm">
          <p>Don't have an account?</p>
          <span className="text-purple-700 hover:underline">
            <Link to={"/sign-up"} element={<SignUp />}>
              Sign Up
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
