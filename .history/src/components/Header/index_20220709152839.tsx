import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.Container}>
        <img src="images/Logo.png" alt="logo"/>
    </header>
  )
}
