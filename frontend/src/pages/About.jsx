import React from "react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6 text-center text-purple-700">
        About Your Todo
      </h1>

      <p className="text-lg text-gray-700 leading-relaxed mb-4">
        <strong>Your Todo</strong> is a simple, elegant, and powerful task
        management app designed to help you organize your daily life. Whether
        you're managing personal tasks, study goals, or work projects, Your Todo
        helps you stay on track and productive.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-4">
        This app was built with modern web technologies like{" "}
        <strong>React</strong>, <strong>Tailwind CSS</strong>, and{" "}
        <strong>React Router</strong> to deliver a smooth and responsive user
        experience.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed">
        Thank you for using Your Todo. Stay organized, stay focused, and get
        things done!
      </p>
    </div>
  );
}
