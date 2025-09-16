import NavbarC from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import styles from "./App.module.scss";

function App() {
  return (
    <>
      <NavbarC />
      <div className={styles.contentContainer}>
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
