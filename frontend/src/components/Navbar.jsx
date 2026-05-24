import { Link } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <Link
        to="/"
        className="text-2xl font-bold text-blue-600"
      >
        EasyGo
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/" className="text-gray-700">
          Home
        </Link>

        {token ? (
          <>
            {/* User Recommendations */}
            {user?.role === "user" && (
              <Link
                to="/recommendations"
                className="text-gray-700"
              >
                Recommendations
              </Link>
            )}

            {/* User Bookings */}
            {user?.role === "user" && (
              <Link
                to="/my-bookings"
                className="text-gray-700"
              >
                My Bookings
              </Link>
            )}

            {/* Owner Dashboard */}
            {user?.role === "owner" && (
              <Link
                to="/owner"
                className="text-gray-700"
              >
                Owner Dashboard
              </Link>
            )}

            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="text-gray-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;