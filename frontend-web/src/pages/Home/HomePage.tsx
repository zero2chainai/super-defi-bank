import { toast } from "react-toastify";
import { useBank } from "../../hooks/useBank";
import { useUser } from "../../hooks/useUser";
import styles from "./Home.module.scss";
import { useState } from "react";

const HomePage = () => {
  const { user, isLoggedIn, updateUser } = useUser(); // make sure updateUser exists in your context
  const { depositToken, getBalance, withdraw } = useBank();

  const [depositAmount, setDepositAmount] = useState<string>("0");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("0");
  const [depositedBalance, setDepositedBalance] = useState<string>("0");

  const handleDepositClick = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }

    if (Number(depositAmount) > Number(user?.bankTokens)) {
      toast.error("Insufficient balance");
      return;
    }

    const response = await depositToken(depositAmount);
    if (response?.success) {
      toast.success(`Deposited ${depositAmount} ETH successfully`);
      updateUser?.({
        bankTokens: Number(user?.bankTokens || 0) - Number(depositAmount),
        depositedTokens: Number(user?.depositedTokens || 0) + Number(depositAmount),
      });
      setDepositAmount("0");
    } else {
      toast.error(response?.error);
    }
  };

  const handleWithdrawClick = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      toast.error("Please enter a valid withdraw amount");
      return;
    }

    const response = await withdraw(withdrawAmount); // make sure withdraw accepts amount
    if (response?.success) {
      toast.success(`Withdrew ${withdrawAmount} ETH successfully`);
      updateUser?.({
        bankTokens: Number(user?.bankTokens || 0) + Number(withdrawAmount),
        depositedTokens: Number(user?.depositedTokens || 0) - Number(withdrawAmount),
      });
      setWithdrawAmount("0");
    } else {
      toast.error(response?.error);
    }
  };

  const handleGetBalanceClick = async () => {
    const balance = await getBalance();
    setDepositedBalance(balance as string);
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.welcomeHeading}>
        Welcome, {user?.name || "Guest"}
      </h1>

      {isLoggedIn ? (
        <section className={styles.section}>
          <p className={styles.balance}>Current balance: {String(user?.bankTokens)}</p>

          <div className={styles.controls}>
            {/* Deposit */}
            <div className={styles.actionGroup}>
              <input
                type="number"
                placeholder="Enter deposit amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className={styles.input}
              />
              <button className={styles.deposit} onClick={handleDepositClick}>
                Deposit
              </button>
            </div>

            {/* Withdraw */}
            <div className={styles.actionGroup}>
              <input
                type="number"
                placeholder="Enter withdraw amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className={styles.input}
              />
              <button className={styles.withdraw} onClick={handleWithdrawClick}>
                Withdraw
              </button>
            </div>

            {/* Get balance */}
            <button
              className={styles.getBalance}
              onClick={handleGetBalanceClick}
            >
              Get Balance
            </button>
          </div>

          <p className={styles.paragraph}>Deposited Balance: {depositedBalance}</p>
        </section>
      ) : (
        <p className={styles.paragraph}>Please login to access bank</p>
      )}
    </div>
  );
};

export default HomePage;