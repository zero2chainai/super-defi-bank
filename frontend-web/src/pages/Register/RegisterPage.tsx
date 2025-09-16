import { useState } from "react";
import FormInput from "../../components/FormInput";
import { EmptyUser, type User } from "../../types/user";
import styles from "./RegisterPage.module.scss";
import api from "../../api/axios";

const RegisterPage = () => {
  const [user, setUser] = useState<Omit<User, "_id">>(EmptyUser);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const connectWallet = async () => {
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
      console.log("Please install MetaMask in the browser");
      setIsWalletConnected(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.name.trim()) {
      alert("Please fill in all the fields");
      return;
    }
    if (!user.walletAddress) {
      alert("Please connect your wallet");
      return;
    }
    try {
      const response = await api.post("users/register", user);
      console.log(response.data);
    } catch (error) {
      console.log(error);
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
            onClick={connectWallet}
          >
            { isWalletConnected ? "Connected" : "Connect Wallet" }
          </button>
        </div>
        <button className={styles.btn}>Submit</button>
      </form>
    </div>
  );
};

export default RegisterPage;
