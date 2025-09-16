import { toast } from "react-toastify";
import api from "../../api/axios";
import { useUser } from "../../hooks/useUser";
import styles from "./NavbarC.module.scss";
import { NavLink, useNavigate } from "react-router-dom";

const NavbarC = () => {
  const { isLoggedIn, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await api.post("/users/logout");
      toast.success(response.data.message);
      logout();
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  }

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.logo}>Super DeFi Bank</div>
      <ul className={styles.links}>
        <li className={styles.linkItems}>
          <NavLink to="/" className={styles.link}>
            Home
          </NavLink>
        </li>
        {!isLoggedIn && (
          <li className={styles.linkItems}>
            <NavLink to="/register" className={styles.link}>
              Register
            </NavLink>
          </li>
        )}
        {!isLoggedIn && (
          <li className={styles.linkItems}>
            <NavLink to="/login" className={styles.link}>
              Login
            </NavLink>
          </li>
        )}
        {isLoggedIn && (
          <li className={styles.linkItems}>
            <a onClick={handleLogout} className={styles.link}>
              Logout
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default NavbarC;
