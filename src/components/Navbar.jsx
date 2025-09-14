import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const goTo = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    goTo("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div
              className="text-xl font-bold cursor-pointer"
              onClick={() => goTo("/")}
            >
              📰 NewsApp
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              <button onClick={() => goTo("/news")} className="hover:underline cursor-pointer">
                All News
              </button>

              {user ? (
                <>
                  <button onClick={() => goTo("/reporter")} className="hover:underline cursor-pointer">
                    Reporter Page
                  </button>
                  <button onClick={() => goTo("/profile")} className="hover:underline cursor-pointer">
                    Profile
                  </button>
                  <button onClick={handleLogout} className="hover:underline cursor-pointer">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => goTo("/login")} className="hover:underline cursor-pointer">
                    Login
                  </button>
                  <button onClick={() => goTo("/signup")} className="hover:underline cursor-pointer">
                    Signup
                  </button>
                </>
              )}
            </div>

            {/* Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none z-50 cursor-pointer"
              >
                {isOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Slide-in Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-blue-600 text-white z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-lg flex flex-col p-6`}
      >
        <h2 className="text-2xl font-bold mb-6 cursor-pointer" onClick={() => goTo("/")}>
          📰 NewsApp
        </h2>

        <button onClick={() => goTo("/news")} className="mb-3 text-left hover:underline cursor-pointer">
          All News
        </button>

        {user ? (
          <>
            <button onClick={() => goTo("/reporter")} className="mb-3 text-left hover:underline cursor-pointer">
              Reporter Page
            </button>
            <button onClick={() => goTo("/profile")} className="mb-3 text-left hover:underline cursor-pointer">
              Profile
            </button>
            <button onClick={handleLogout} className="mb-3 text-left hover:underline cursor-pointer">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => goTo("/login")} className="mb-3 text-left hover:underline cursor-pointer">
              Login
            </button>
            <button onClick={() => goTo("/signup")} className="mb-3 text-left hover:underline cursor-pointer">
              Signup
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;


