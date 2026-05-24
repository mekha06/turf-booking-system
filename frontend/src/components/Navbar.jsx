import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const isHomePage = location.pathname === "/";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        EasyGo
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/" className="text-gray-700">
          Home
        </Link>

        {isHomePage ? (
          <>
            <Link to="/login" className="text-gray-700">
              Login
            </Link>

            <Link to="/register" className="text-gray-700">
              Register
            </Link>
          </>
        ) : token ? (
          <>
            <Link to="/my-bookings" className="text-gray-700">
              My Bookings
            </Link>

            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700">
              Login
            </Link>

            <Link to="/register" className="text-gray-700">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;