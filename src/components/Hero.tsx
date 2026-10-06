'use client'

import Image from 'next/image'
import { ArrowIcon, BagIcon, HeartIcon, WhatsappIcon } from '@/components/icons'
import { whatsappLink } from '@/lib/whatsapp'
import type { SiteSettings } from '@/types/product'
import styles from './Hero.module.css'

interface HeroProps {
  settings: SiteSettings
  productCount: number
  onScrollTo: (id: string) => void
}

export default function Hero({ settings, onScrollTo }: HeroProps) {
  return (
    <section id="home" dir="rtl" aria-labelledby="hero-title" className={styles.hero}>
      <div className={styles.layout}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>لأن جمالك قصة..</p>
          <h1 id="hero-title" className={styles.title}>
            هنا تبدأ<br />حكاية<br /><span>جمالك...</span>
            <HeartIcon className={styles.titleHeart} />
          </h1>
          <p className={styles.lead}>
            مجموعة مختارة من أفضل منتجات العناية والجمال، لتمنحك إطلالة مميزة كل يوم.
          </p>
          <div className={styles.actions}>
            <button type="button" onClick={() => onScrollTo('shop')} className={styles.primary}>
              <ArrowIcon className="h-4 w-4 shrink-0" />
              اكتشفي مجموعتنا
              <BagIcon className="h-4 w-4 shrink-0" />
            </button>
            <a
              href={whatsappLink(settings.whatsappNumber, settings.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondary}
            >
              <WhatsappIcon className="h-4 w-4 shrink-0" />
              تواصلي معنا
            </a>
          </div>
        </div>
        <figure className={styles.visual}>
          <div className={styles.photoFrame}>
            <Image
              src="/products/hero.webp"
              alt="تشكيلة مستحضرات تجميل وردية وزيوت شفاه وكريم أساس، مع أزهار على قواعد حجرية وزجاجية"
              width={1448}
              height={1086}
              sizes="(min-width: 1280px) 780px, (min-width: 768px) 64vw, 82vw"
              loading="eager"
              fetchPriority="high"
              className={styles.photo}
            />
          </div>
         
        </figure>
      </div>
    </section>
  )
}
