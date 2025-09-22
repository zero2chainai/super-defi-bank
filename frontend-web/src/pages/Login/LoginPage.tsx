import { useEffect, useState } from "react";
import { EmptyUser, type User } from "../../types/user";
import styles from "./Login.module.scss";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useWallet } from "../../contexts/WalletContext";

const LoginPage = () => {
  const [user, setUser] = useState<Omit<User, "_id">>(EmptyUser);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useUser();
  const { account, connectWallet } = useWallet();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (!account) {
      setUser({ ...user, walletAddress: "" });
      return;
    }

    setUser({ ...user, walletAddress: account });

    const handleLogin = async () => {
      try {
        console.log(account);
        const { data } = await api.post("/users/login", {
          walletAddress: account,
        });
        toast.success(data.message);
        login(data.data);
        navigate("/");
      } catch (error: any) {
        console.log(error);
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };

    handleLogin();
  }, [account]);

  const handleWalletConnect = async () => {
    setLoading(true);
    try {
      await connectWallet();
    } catch (error) {
      console.log("Error connecting wallet: ", error);
    }
    setLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <h3 className={styles.loginInfo}>Connect to wallet for login</h3>
      <button className={styles.walletBtn} onClick={handleWalletConnect}>
        {loading ? "Connecting..." : "Connect Wallet"}
      </button>
    </div>
  );
};

export default LoginPage;
