import { useState, useContext } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { NavLink, Outlet } from "react-router-dom";
import Logo from "../Images/Logo_PNG.png";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResponsiveNavbar = () => {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { isLoggedIn, userName, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    setShowMobileNav(false);
    toast.success("Logged out successfully", {
      position: "top-left",
      autoClose: 2000,
      theme: "colored",
      transition: Bounce,
    });
  };

  return (
    <>
      <nav className="w-full fixed top-0 z-50 bg-gradient-to-r from-[#e9cbf0] to-[#712681] shadow-md font-RobotoSlab">
        <div className="max-w-[1240px] mx-auto px-4 flex justify-between items-center h-[90px] relative">
          {/* Logo */}
          <NavLink to="/">
            <img src={Logo} alt="EventWave Logo" className="h-10" />
          </NavLink>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center gap-8 text-white font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `relative pb-1 ${
                    isActive
                      ? "text-white after:scale-x-100 after:bg-[#e9cbf0]"
                      : "after:scale-x-0 text-white"
                  } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:transition-transform after:duration-700 after:origin-left`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `relative pb-1 ${
                    isActive
                      ? "text-white after:scale-x-100 after:bg-[#e9cbf0]"
                      : "after:scale-x-0 text-white"
                  } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:transition-transform after:duration-700 after:origin-left`
                }
              >
                Events
              </NavLink>
            </li>
            {isLoggedIn && (
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `relative pb-1 ${
                      isActive
                        ? "text-white after:scale-x-100 after:bg-[#e9cbf0]"
                        : "after:scale-x-0 text-white"
                    } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:transition-transform after:duration-700 after:origin-left`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
            )}
            {!isLoggedIn ? (
              <NavLink to="/login">
                <button className="px-6 py-2 bg-white text-[#712681] border border-[#712681] rounded-full hover:bg-[#f1e6f7] transition">
                  Login
                </button>
              </NavLink>
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-2 text-white hover:text-[#fcddec] transition focus:outline-none">
                  <FaUserCircle size={24} />
                  <span className="font-medium">{userName}</span>
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition duration-200 z-50">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-[#712681] hover:bg-[#f1e6f7] rounded transition"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-[#712681] hover:bg-[#f1e6f7] rounded transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </ul>

          {/* Mobile toggle icon */}
          <div
            className="md:hidden text-white z-50"
            onClick={() => setShowMobileNav(!showMobileNav)}
          >
            {showMobileNav ? (
              <AiOutlineClose size={24} />
            ) : (
              <AiOutlineMenu size={24} />
            )}
          </div>

          {/* Mobile menu */}
          <ul
            className={`absolute top-[90px] left-0 w-full bg-gradient-to-b from-[#e9cbf0] to-[#712681] text-white font-medium flex flex-col items-center py-6 space-y-4 transition-all duration-300 md:hidden ${
              showMobileNav ? "block" : "hidden"
            }`}
          >
            <li>
              <NavLink
                to="/"
                onClick={() => setShowMobileNav(false)}
                className={({ isActive }) =>
                  `relative pb-1 ${
                    isActive
                      ? "text-white after:scale-x-100 after:bg-[#e9cbf0]"
                      : "after:scale-x-0 text-white"
                  } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:transition-transform after:duration-700 after:origin-left`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/events"
                onClick={() => setShowMobileNav(false)}
                className={({ isActive }) =>
                  `relative pb-1 ${
                    isActive
                      ? "text-white after:scale-x-100 after:bg-[#e9cbf0]"
                      : "after:scale-x-0 text-white"
                  } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:transition-transform after:duration-700 after:origin-left`
                }
              >
                Events
              </NavLink>
            </li>
            {isLoggedIn && (
              <li>
                <NavLink
                  to="/dashboard"
                  onClick={() => setShowMobileNav(false)}
                  className={({ isActive }) =>
                    `relative pb-1 ${
                      isActive
                        ? "text-white after:scale-x-100 after:bg-[#e9cbf0]"
                        : "after:scale-x-0 text-white"
                    } after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:transition-transform after:duration-700 after:origin-left`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
            )}
            {!isLoggedIn ? (
              <li>
                <NavLink to="/login" onClick={() => setShowMobileNav(false)}>
                  <button className="px-6 py-2 bg-white text-[#712681] border border-[#712681] rounded-full hover:bg-[#f1e6f7] transition">
                    Login
                  </button>
                </NavLink>
              </li>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/profile"
                    onClick={() => setShowMobileNav(false)}
                    className="flex items-center gap-2 hover:text-[#fcddec] transition"
                  >
                    <FaUserCircle size={22} />
                    <span className="font-medium">{userName}</span>
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-sm px-6 py-2 bg-white text-[#712681] border border-white rounded-full hover:bg-[#f1e6f7] transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Push content below nav */}
      <div className="pt-[90px]">
        <Outlet />
      </div>
    </>
  );
};

export default ResponsiveNavbar;
