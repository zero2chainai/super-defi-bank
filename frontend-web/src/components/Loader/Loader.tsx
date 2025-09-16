import styles from "./Loader.module.scss";

const Loader = ({ text }: { text: string }) => {
  return <div className={styles.loader}>{text}</div>;
};

export default Loader;
