import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutSuccess } from "../redux/user/userSlice"; // make sure this action exists
import { toast } from "react-toastify";

export default function Header() {
  const activePath = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { currentUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const linkStyle = (path) =>
    `hover:underline transition duration-150 ${
      activePath === path
        ? "text-purple-300 font-semibold underline"
        : "text-gray-200"
    }`;

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/v1/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(logoutSuccess());
        toast.success("Logged out successfully");
        sessionStorage.clear();
        navigate("/sign-in");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="w-screen bg-[#7c3aed] mb-10">
      <div className="max-w-[80%] mx-auto py-4">
        {/* Top section */}
        <div className="flex items-center justify-between sm:justify-start">
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-bold text-xl"
          >
            📝 Your Todo
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="sm:hidden text-white focus:outline-none"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav
          className={`mt-4 sm:mt-0 ${
            isOpen ? "block" : "hidden"
          } sm:flex sm:items-center sm:justify-between`}
        >
          <ul className="flex flex-col sm:flex-row gap-4 sm:gap-10">
            <li>
              <Link to="/" className={linkStyle("/")}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={linkStyle("/about")}>
                About
              </Link>
            </li>
          </ul>

          <ul className="flex flex-col sm:flex-row gap-4 sm:ml-6 sm:gap-10 mt-4 sm:mt-0">
            {currentUser ? (
              <li
                onClick={() => setShowLogoutModal(true)}
                className="bg-slate-100 text-xl text-purple-800 cursor-pointer rounded-full p-2 text-center hover:bg-slate-200 transition"
              >
                {currentUser.username}
              </li>
            ) : (
              <li>
                <Link to="/sign-in" className={linkStyle("/sign-in")}>
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleLogout();
                  setShowLogoutModal(false);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
