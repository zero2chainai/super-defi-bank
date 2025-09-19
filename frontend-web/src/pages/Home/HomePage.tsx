import { toast } from "react-toastify";
import { useBank } from "../../hooks/useBank";
import { useUser } from "../../hooks/useUser";
import styles from "./Home.module.scss";
import { useState } from "react";

const HomePage = () => {
  const { user, isLoggedIn } = useUser();
  const { depositToken, getBalance, withdraw } = useBank();
  const [depositedBalance, setDepositedBalance] = useState<string>("0");

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.welcomeHeading}>
        Welcome, {user?.name || "Guest"}
      </h1>
      {isLoggedIn ? (
        <section className={styles.section}>
          <p className={styles.balance}>Current balance: {user?.balance}</p>
          <div className={styles.controls}>
            <button
              className={styles.deposit}
              onClick={async () => {
                const response = await depositToken("0.5");
                if (response?.success) {
                  toast.success("Deposit successful");
                } else {
                  toast.error(response?.error);
                }
              }}
            >
              Deposit
            </button>
            <button className={styles.withdraw} onClick={
              async () => {
                const response = await withdraw();
                if (response?.success) {
                  toast.success("Withdrawal successful");
                }
              }
            }>Withdraw</button>
            <button
              className={styles.getBalance}
              onClick={async () => {
                const balance = await getBalance();
                setDepositedBalance(balance as string);
              }}
            >
              Get Balance
            </button>
          </div>
          <p className={styles.paragraph}>{ depositedBalance }</p>
        </section>
      ) : (
        <p className={styles.paragraph}>Please login to access bank</p>
      )}
    </div>
  );
};

export default HomePage;
