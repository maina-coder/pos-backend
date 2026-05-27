import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const cachedToken = localStorage.getItem("pos_token");
    const cachedUser = localStorage.getItem("pos_user");
    if (cachedToken && cachedUser) {
      setToken(cachedToken);
      setUsername(cachedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (user, tokenHash) => {
    localStorage.setItem("pos_token", tokenHash);
    localStorage.setItem("pos_user", user);
    setToken(tokenHash);
    setUsername(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos_user");
    setToken("");
    setUsername("");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}