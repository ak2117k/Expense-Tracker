import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Finance Tracker+
        </Link>
        <div className="space-x-4 flex items-center">
          {!auth.token ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium text-white bg-indigo-600 px-4 py-1.5 rounded-xl hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/expenses"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Expenses
              </Link>
              <Link
                to="/budget"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Budget
              </Link>
              <Link
                to="/reports"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Reports
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
