import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logoutSuccess } from "../redux/user/userSlice";

export default function AutoLogout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const res = await fetch(`/api/v1/auth/me`);
        const data = await res.json();

        if (!res.ok) {
          const logoutRes = await fetch("/api/v1/user/signout", {
            method: "POST",
          });

          if (logoutRes.ok) {
            sessionStorage.clear();
            dispatch(logoutSuccess());
            navigate("/sign-in");
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log("Error during autologout");
        navigate("/sign-in");
      }
    };
    authenticateUser();
  }, [navigate, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return <Outlet />;
}
