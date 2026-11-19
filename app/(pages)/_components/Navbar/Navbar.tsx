'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RxHamburgerMenu, RxCross2 } from 'react-icons/rx';

import styles from './Navbar.module.scss';
import useToggle from '@hooks/useToggle';
import AuthButton from '../AuthButton/AuthButton';
import LogoIcon from '../Mascot/LogoIcon';

interface NavLink {
  name: string;
  slug: string;
}

export default function Navbar({ navLinks }: { navLinks: NavLink[] }) {
  const pathname = usePathname();
  const {
    state: open,
    toggleState: toggleOpen,
    setOff: close,
  } = useToggle(false);

  const isCurrent = (slug: string) =>
    slug === '/' ? pathname === '/' : pathname.startsWith(slug);

  return (
    <div className={styles.wrapper}>
      <header className={styles.bar}>
        <Link href="/" className={styles.brand} onClick={close}>
          <LogoIcon />
          <span>Meal Pal</span>
        </Link>

        <button
          className={styles.menuButton}
          onClick={toggleOpen}
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="main-nav"
        >
          {open ? <RxCross2 /> : <RxHamburgerMenu />}
        </button>

        <nav
          id="main-nav"
          aria-label="Main"
          className={`${styles.links} ${open ? styles.open : ''}`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.slug}
              href={link.slug}
              onClick={close}
              className={styles.link}
              aria-current={isCurrent(link.slug) ? 'page' : undefined}
            >
              {link.name}
            </Link>
          ))}
          <AuthButton className={styles.authButton} />
        </nav>
      </header>
    </div>
  );
}
