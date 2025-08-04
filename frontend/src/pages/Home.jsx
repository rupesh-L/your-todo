import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-screen max-w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gradient bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Organize Your <br /> Life, One Task at a Time
        </h1>
        <p className="mt-6 sm:text-xs md:text-lg text-gray-600 max-w-xl">
          Simple, fast, and elegant todo app to keep you focused and productive
          every day.
        </p>
        <button className="mt-4 px-4 py-2 rounded-full bg-purple-700 text-gray-200 transition duration-300 transform hover:-translate-y-1 hover:shadow-lg">
          <Link to={"/sign-in"}>Getting Started</Link>
        </button>
      </div>
      <div>
        <img
          src="https://cdn.pixabay.com/photo/2024/05/07/00/39/schedule-8744592_1280.png"
          className="object-cover"
          alt="hero"
        />
      </div>
    </div>
  );
}
