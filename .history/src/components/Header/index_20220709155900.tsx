import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.Container}>
      <Link href="/">
        <img src="images/Logo.png" alt="logo"/>
      </Link>
    </header>
  )
}
