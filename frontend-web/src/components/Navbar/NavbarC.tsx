import styles from './NavbarC.module.scss';
import { NavLink } from 'react-router-dom';

const NavbarC = () => {
  return (
    <div className={styles.navbarContainer}>
        <div className={styles.logo}>Super DeFi Bank</div>
        <ul className={styles.links}>
            <li className={styles.linkItems}>
                <NavLink to="/" className={styles.link}>Home</NavLink>
            </li>
            <li className={styles.linkItems}>
                <NavLink to="/register" className={styles.link}>Register</NavLink>
            </li>
        </ul>
    </div>
  )
}

export default NavbarC