import Link from 'next/link';
import styles from './Footer.module.scss';

interface NavLink {
  name: string;
  slug: string;
}

export default function Footer({ navLinks }: { navLinks: NavLink[] }) {
  return (
    <div className={styles.container}>
      <div className={styles.content_container}>
        <div className={styles.description}>
          <h2>Meal Buddy</h2>
          <p>
            Explore Recipes or Create Some of Your Own!
          </p>
        </div>
        <div className={styles.navigation}>
          <div className={styles.learn_more}>
            <h2>Learn more</h2>
            <div className={styles.learn_more_links}>
              {navLinks.map((link) => {
                return (
                  <Link key={link.slug} href={link.slug}>
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
      <p className={styles.credit}>
        Designed & developed with 🤍 by Rachel Lin @2025
      </p>
    </div>
  );
}
