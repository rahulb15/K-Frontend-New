import styles from "./page.module.css";
import LaunchPad from "./launchpad/page";

export default function Home() {
  return (
    <main className={styles.main}>
      <LaunchPad />
    </main>
  );
}
