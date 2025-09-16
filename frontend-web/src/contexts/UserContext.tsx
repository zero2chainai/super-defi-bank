import { createContext, useState } from "react";
import type { User } from "../types/user";

interface UserContextProps {
  user: User | null;
  setCurrentUser: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const setCurrentUser = (user: User) => {
    setUser(user);
    setIsLoggedIn(true);
  };

  const login = (user: User) => {
    setUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider
      value={{ user, login, logout, setCurrentUser, isLoggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};
