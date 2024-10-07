import Navbar from "./Assets/components/Navbar/navbar";
import Topbar from "./Assets/components/Topbar/Topbar";
import SubNavigationBilling from "./Assets/components/SubNavigationBilling/SubNavigationBilling";

import styles from "./styles.module.css";

export default function Home() {
  return (
    <div>
      <div className={styles.container}>
          <Topbar className={styles.topbar} />
          <Navbar className={styles.navbar} />
          <SubNavigationBilling className={styles.subnav} />
      </div>
    </div>
  );
}
