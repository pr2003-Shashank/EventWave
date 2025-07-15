import { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user", "token"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(""); // "User" or "Organizer"
  const [userName, setUserName] = useState("");
  const [customerUserName, setCustomerUserName] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cookies.user && cookies.token) {
      setIsLoggedIn(true);
      setRole(cookies.user.role);
      setUserName(cookies.user.fullName);
      setCustomerUserName(cookies.user.customer_username);
      setToken(cookies.token);
      
    }
    setLoading(false);
  }, [cookies]);

  // Login method (used in Login.jsx)
  const login = ({ fullName, role, token ,customer_username}) => {
    setIsLoggedIn(true);
    setRole(role);
    setUserName(fullName);
    setToken(token);
    setCustomerUserName(customer_username)
    // Save to cookies
    setCookie("user", { fullName, role ,customer_username }, { path: "/", maxAge: 86400 }); // 1 day
    setCookie("token", token, { path: "/", maxAge: 86400 }); // 1 day
  };

  // Logout method (can be used in Navbar)
  const logout = () => {
    setIsLoggedIn(false);
    setRole("");
    setUserName("");
    setCustomerUserName("");
    setToken("");

    removeCookie("user");
    removeCookie("token");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, userName,customerUserName, token, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};