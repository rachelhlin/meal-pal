'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RxHamburgerMenu, RxCross2 } from 'react-icons/rx';

import styles from './Navbar.module.scss';
import useToggle from '@hooks/useToggle';
import AuthButton from '../AuthButton/AuthButton';

interface NavLink {
  name: string;
  slug: string;
}

export default function Navbar({ navLinks }: { navLinks: NavLink[] }) {
  const pathname = usePathname();
  const {
    state: active,
    toggleState: toggleActive,
    setOff: setInactive,
  } = useToggle(false);

  const isCurrent = (slug: string) =>
    slug === '/' ? pathname === '/' : pathname.startsWith(slug);

  return (
    <div className={styles.relative_wrapper}>
      <div className={styles.container}>
        <h2>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Meal Pal
          </Link>
        </h2>
        <div className={styles.nav_container}>
          <div className={`${styles.links} ${active ? styles.active : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.slug}
                href={link.slug}
                onClick={setInactive}
                aria-current={isCurrent(link.slug) ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}
            <AuthButton className={styles.authButton} />
          </div>
          <button
            className={styles.menu}
            onClick={toggleActive}
            aria-label="Toggle menu"
            aria-expanded={active}
          >
            {active ? <RxCross2 /> : <RxHamburgerMenu />}
          </button>
        </div>
      </div>
    </div>
  );
}
