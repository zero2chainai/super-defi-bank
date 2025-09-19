import { useBank } from "../../hooks/useBank";
import { useUser } from "../../hooks/useUser";
import styles from "./Home.module.scss";

const HomePage = () => {
  const { user, isLoggedIn } = useUser();
  const { depositToken, getBalance } = useBank();

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
              onClick={async () => await depositToken("0.5")}
            >
              Deposit
            </button>
            <button className={styles.withdraw}>Withdraw</button>
            <button
              className={styles.getBalance}
              onClick={async () => await getBalance()}
            >
              Get Balance
            </button>
          </div>
        </section>
      ) : (
        <p className={styles.paragraph}>Please login to access bank</p>
      )}
    </div>
  );
};

export default HomePage;
