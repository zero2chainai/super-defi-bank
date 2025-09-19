import { createContext, useEffect, useState } from "react";
import type { User } from "../types/user";
import api from "../api/axios";
import { toast } from "react-toastify";

interface UserContextProps {
  user: User | null;
  setCurrentUser: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
  loading: boolean;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/users/me");
        setCurrentUser(data.data);
        setLoading(false);
      } catch (error: any) {
        toast.error(error.reponse?.data?.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
      value={{ user, login, logout, setCurrentUser, isLoggedIn, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};
