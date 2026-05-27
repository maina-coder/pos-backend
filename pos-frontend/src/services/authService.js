const API_URL = "http://127.0.0.1:8000/api/auth/login/";

const authService = {
  // 🛰️ NEW: Network call to send credentials to Django
  login: async (username, password) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    
    return response; // Returns the full response stream (status code, JSON token, etc.)
  },

  // 💾 Your existing local storage managers (Kept perfectly intact!)
  setToken: (token) =>
    localStorage.setItem("pos_token", token),

  getToken: () =>
    localStorage.getItem("pos_token"),

  setUser: (user) =>
    localStorage.setItem(
      "pos_user",
      JSON.stringify(user)
    ),

  getUser: () => {
    const user = localStorage.getItem("pos_user");
    return user ? JSON.parse(user) : null;
  },

  clear: () => {
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos_user");
  }
};

export default authService;n