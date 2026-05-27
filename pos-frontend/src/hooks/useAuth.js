import { useState, useEffect } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const cachedUser = localStorage.getItem("pos_user");
    const cachedToken = localStorage.getItem("pos_token");
    if (cachedUser && cachedToken) {
      setUser({ username: cachedUser });
      setToken(cachedToken);
    }
  }, []);

  const login = (username, tokenHash) => {
    localStorage.setItem("pos_user", username);
    localStorage.setItem("pos_token", tokenHash);
    setUser({ username });
    setToken(tokenHash);
  };

  const logout = () => {
    localStorage.removeItem("pos_user");
    localStorage.removeItem("pos_token");
    setUser(null);
    setToken("");
  };

  return { user, token, login, logout };
}