import Link from 'next/link';

import styles from './Footer.module.scss';
import LogoIcon from '../Mascot/LogoIcon';

interface NavLink {
  name: string;
  slug: string;
}

export default function Footer({ navLinks }: { navLinks: NavLink[] }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <LogoIcon size={32} steam={false} />
          <div>
            <p className={styles.name}>Meal Pal</p>
            <p>Recipes from home cooks</p>
          </div>
        </div>
        <nav aria-label="Footer" className={styles.links}>
          {navLinks.map((link) => (
            <Link key={link.slug} href={link.slug}>
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <p className={styles.credit}>
        Designed &amp; developed with 🤍 by Rachel Lin @2025
      </p>
    </footer>
  );
}
