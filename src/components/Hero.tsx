'use client'

import Image from 'next/image'
import { ArrowIcon, SparklesIcon, StarIcon, WhatsappIcon } from '@/components/icons'
import { whatsappLink } from '@/lib/whatsapp'
import type { SiteSettings } from '@/types/product'

/** Hero collage images, taken from the original prototype. */
const COLLAGUE = {
  main: '/products/mascara.png',
  lipOil: '/products/lip-oil.png',
  aloe: '/products/aloe-foam.png',
  foundation: '/products/foundation.png',
}

interface HeroProps {
  settings: SiteSettings
  productCount: number
  onScrollTo: (id: string) => void
}

export default function Hero({ settings, productCount, onScrollTo }: HeroProps) {
  return (
    <section id="home" className="relative mx-auto max-w-[1280px] overflow-hidden px-4 md:px-8">
      <div className="grid items-center gap-8 overflow-hidden py-10 md:grid-cols-[1.1fr_0.9fr] md:py-16 lg:gap-6">
        <div className="relative order-1 md:order-2">
          <div aria-hidden className="pointer-events-none absolute -top-8 -right-6 opacity-20 md:-top-12 md:right-0">
            <div className="h-28 w-28 rotate-12 rounded-[32px] border border-gold/20 bg-gradient-to-br from-white to-blush p-3 shadow-[0_20px_40px_rgba(201,168,106,0.15)]">
              <Image
                src="/brand/logo.jpg"
                alt=""
                width={112}
                height={112}
                className="h-full w-full rounded-[20px] object-cover opacity-80"
              />
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-white/70 px-4 py-1.5 text-[12px] font-medium text-[#B78A4E] backdrop-blur">
            <SparklesIcon className="h-4 w-4 text-rose" />
            {settings.storeTagline}
          </span>

          <h1 className="mt-6 max-w-[22ch] text-[32px] font-[800] leading-[1.15] tracking-tight md:text-[44px]">
            هنا تبدأ حكاية جمالك...
            <span className="block bg-gradient-to-l from-rose to-gold bg-clip-text text-transparent">
              من رائحة تعبّر عن شخصيتك
            </span>
            <span className="text-[26px] font-medium leading-[1.35] text-cocoa/80 md:text-[28px]">
              إلى لمسة ترطيب تمنحك إحساسًا بالانتعاش والثقة 💕
            </span>
          </h1>

          <p className="mt-5 max-w-[48ch] text-[15.5px] leading-7 text-cocoa/70">
            نختار لكِ أجمل منتجات العناية والجمال من العطور، بخاخات الجسم ومرطبات الشفاه، بتصاميم أنيقة
            وروائح تأخذك إلى أجواء مختلفة؛ صيف مشرق، لحظة رومانسية، مناسبة مميزة أو يوم عادي يستحق
            القليل من الدلال ✨
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onScrollTo('shop')}
              className="group inline-flex items-center gap-2 rounded-full bg-cocoa px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_30px_rgba(74,46,42,0.25)] transition hover:bg-rose"
            >
              اكتشفي مجموعتنا
              <ArrowIcon className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <a
              href={whatsappLink(settings.whatsappNumber, settings.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-7 py-3.5 text-[15px] font-bold text-cocoa shadow-sm transition hover:border-rose/30 hover:text-rose"
            >
              <WhatsappIcon className="h-4 w-4" />
              تواصلي معنا
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 text-[13px] text-cocoa/60">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" />
              منتجات أصلية
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose" />
              توصيل في الأردن
            </span>
            <span className="hidden items-center gap-2 sm:flex">
              <StarIcon className="h-3.5 w-3.5 fill-gold text-gold" />
              تقييم 4.9 • {productCount} منتج
            </span>
          </div>
        </div>

        <div className="relative order-2 md:order-1">
          <div className="relative mx-auto aspect-[0.95] max-w-[520px]">
            <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#FFD6E3]/70 to-[#FFB8D0]/70 blur-[36px]" />
            <div className="absolute left-[8%] top-[10%] h-6 w-6 rounded-full bg-white/80 shadow-[0_4px_12px_rgba(232,106,146,0.15)] backdrop-blur" />
            <div className="absolute right-[12%] top-[18%] h-4 w-4 rounded-full bg-white/70 shadow" />
            <div className="absolute bottom-[18%] left-[15%] h-3 w-3 rounded-full bg-rose/20" />

            <div className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] rounded-[28px] border border-white/60 bg-white p-3 shadow-[0_30px_60px_rgba(74,46,42,0.15)] backdrop-blur">
              <div className="overflow-hidden rounded-[20px] bg-cream">
                <Image
                  src={COLLAGUE.main}
                  alt="ماسكارا مغذية"
                  width={520}
                  height={693}
                  className="aspect-[3/4] w-full object-cover"
                  priority
                />
              </div>
              <div className="px-2 py-3 text-center">
                <div className="text-[12px] font-bold text-rose">جديد</div>
                <div className="text-[14px] font-bold">ماسكارا مغذية</div>
              </div>
            </div>

            <div className="absolute bottom-[6%] left-[2%] w-[38%] rotate-[6deg] rounded-[22px] border border-white/70 bg-white/90 p-2 shadow-[0_20px_40px_rgba(74,46,42,0.12)] backdrop-blur-xl">
              <Image
                src={COLLAGUE.lipOil}
                alt="Magic Lip Oil"
                width={200}
                height={200}
                className="aspect-square w-full rounded-[16px] object-cover"
              />
              <div className="mt-2 text-center text-[11px] font-bold">Magic Lip Oil</div>
            </div>

            <div className="absolute right-[4%] top-[4%] w-[34%] rotate-[8deg] rounded-[20px] border border-white/70 bg-white p-2 shadow-[0_18px_36px_rgba(74,46,42,0.12)]">
              <Image
                src={COLLAGUE.aloe}
                alt="غسول الألوفيرا"
                width={180}
                height={180}
                className="aspect-square w-full rounded-[14px] object-cover"
              />
            </div>

            <div className="absolute bottom-[22%] right-[2%] w-[28%] -rotate-[8deg] rounded-[18px] bg-white p-1.5 shadow-[0_14px_28px_rgba(74,46,42,0.1)]">
              <Image
                src={COLLAGUE.foundation}
                alt="كريم أساس"
                width={150}
                height={150}
                className="aspect-square w-full rounded-[12px] object-cover"
              />
            </div>

            <div className="absolute left-[10%] top-[50%] rounded-full bg-cocoa px-3.5 py-2 text-[12px] font-bold text-white shadow-lg">
              من 3 JOD
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
