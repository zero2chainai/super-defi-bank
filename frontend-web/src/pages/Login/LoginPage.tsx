import { useEffect, useState } from "react";
import { EmptyUser, type User } from "../../types/user";
import styles from "./Login.module.scss";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useWalletConnect } from "../../hooks/useWalletConnect";

const LoginPage = () => {
  const [user, setUser] = useState<Omit<User, "_id">>(EmptyUser);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useUser();
  const { account, connectWallet } = useWalletConnect();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (account) {
      setUser({ ...user, walletAddress: account });
      setIsWalletConnected(true);
    } else {
      setUser({ ...user, walletAddress: "" });
      setIsWalletConnected(false);
    }
  }, [account]);

  useEffect(() => {
    const handleLogin = async () => {
      if (!user.walletAddress) {
        toast.error("Please connect your wallet");
        return;
      }

      try {
        const { data } = await api.post("/users/login", user);
        toast.success(data.message);
        login(data.data);
        navigate("/");
      } catch (error: any) {
        console.log(error);
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };

    if (isWalletConnected) {
      handleLogin();
    }
  }, [isWalletConnected]);

  const handleWalletConnect = async () => {
    setLoading(true);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUser({ ...user, walletAddress: accounts[0] });
        setIsWalletConnected(true);
      } catch (error) {
        console.log(error);
        setIsWalletConnected(false);
      }
    } else {
      await connectWallet();
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
