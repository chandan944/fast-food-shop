// ✅ Import required hooks
import React, { createContext, useState, useEffect, useContext } from "react";

// ✅ Create the Context
const AuthContext = createContext();

// ✅ Custom hook to use AuthContext anywhere
export const useAuth = () => useContext(AuthContext);

// ✅ Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔥 Load token from localStorage on page refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    // If token exists, save it to state
    if (token && token !== "null" && token !== "undefined") {
      setUser({ token });
    } else {
      setUser(null);
    }
  }, []);

  // 🔥 Login function
  const login = async (email, password) => {
    const res = await fetch("http://localhost:8080/api/v1/authentication/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();

    // Save token locally
    localStorage.setItem("token", data.token);

    // Update user state
    setUser({ token: data.token });
  };

  // 🔥 Signup function
  const signup = async (name, email, password, contact, address) => {
    const res = await fetch("http://localhost:8080/api/v1/authentication/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, contact, address }),
    });

    const data = await res.json();

    // Save token after signup
    localStorage.setItem("token", data.token);

    // Update user state
    setUser({ token: data.token });
  };

  // 🔥 Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Provide everything to the App
  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Default export so importing becomes easier
export default AuthContext;
