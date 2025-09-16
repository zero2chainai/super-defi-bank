import { useEffect, useState } from "react";
import api from "../api/axios";
import { useUser } from "../hooks/useUser";
import { toast } from "react-toastify";

export const getCurrentUser = () => {
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useUser();

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

  return loading;
};
