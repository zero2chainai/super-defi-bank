import NavbarC from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import styles from "./App.module.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Loader from "./components/Loader";
import { useUser } from "./hooks/useUser";

function App() {
  const { loading } = useUser();

  if (loading) return <Loader text="Loading..."/>
  
  return (
    <>
      <NavbarC />
      <div className={styles.contentContainer}>
        <AppRoutes />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
