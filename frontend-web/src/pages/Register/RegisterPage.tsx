import { useEffect, useState } from "react";
import FormInput from "../../components/FormInput";
import { EmptyUser, type User } from "../../types/user";
import styles from "./RegisterPage.module.scss";
import api from "../../api/axios";
import { useUser } from "../../hooks/useUser";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useWalletConnect } from "../../hooks/useWalletConnect";

const RegisterPage = () => {
  const [user, setUser] = useState<Omit<User, "_id">>(EmptyUser);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isLoggedIn } = useUser();
  const navigate = useNavigate();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; 
    setUser({ ...user, [name]: value });
  };

  const handleWalletClick = async () => {
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
      console.log("Account: ", account);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.name.trim()) {
      toast.error("Fill all the require fields");
      return;
    }
    if (!user.walletAddress) {
      toast.error("Please connect your wallet");
      return;
    }
    try {
      const { data } = await api.post("users/register", user);
      login(data.data);
      toast.success(data.message);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <h1 className={styles.heading}>Register</h1>
        <FormInput
          id="name"
          value={user.name}
          name="name"
          label="Name"
          placeholder="Enter your name"
          onChange={handleChange}
        />
        <div className={styles.walletBtnContainer}>
          <button
            className={styles.walletBtn}
            type="button"
            onClick={handleWalletClick}
          >
            {isWalletConnected
              ? "Connected"
              : loading
              ? "Connecting..."
              : "Connect Wallet"}
          </button>
        </div>
        <button className={styles.btn}>Submit</button>
      </form>
    </div>
  );
};

export default RegisterPage;
