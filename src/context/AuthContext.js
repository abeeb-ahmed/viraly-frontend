import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(
  JSON.parse(localStorage.getItem("user")) || null
);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const login = (user) => {
    // TODO
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (user) => {
    setCurrentUser((prev) => ({
      ...prev,
      name: user.name,
      email: user.email,
      city: user.city,
      profilePic: user.profilePic,
      username: user.username,
      website: user.website,
    }));
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
