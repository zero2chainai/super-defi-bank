import { useUser } from "../../hooks/useUser";
import styles from "./Home.module.scss";

const HomePage = () => {
  const { user } = useUser();

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.welcomeHeading}>
        Welcome, {user?.name || "Guest"}
      </h1>
      <section className={styles.section}>
        <p className={styles.balance}>Current balance: {user?.balance}</p>
        <div className={styles.controls}>
          <button className={styles.deposit}>Deposit</button>
          <button className={styles.withdraw}>Withdraw</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
