import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-9xl font-extrabold text-red-600">404</h1>
      <p className="text-2xl mt-4 text-gray-700 flex items-center gap-2">
        Page not found
        <span role="img" aria-label="shrug">
          🤷‍♂️
        </span>
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
