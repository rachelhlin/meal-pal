'use client';

import Link from 'next/link';
import Image from 'next/image';

import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <div className={styles.container}>
      <div className={styles.img_container}>
        <Image
          src="/index/food.jpeg"
          alt="food image"
          fill
          style={{ objectFit: 'cover', opacity: '0.6' }}
        />
      </div>
      <div className={styles.welcome}>
        <h1>Looking for recipes?</h1>
        <Link href="/explore-page" className={styles.button}>
          Explore Now
        </Link>
      </div>
    </div>
  );
}
