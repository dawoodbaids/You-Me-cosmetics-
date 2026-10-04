'use client'

import Image from 'next/image'
import { useState } from 'react'
import {
  FacebookIcon,
  InstagramIcon,
  LockIcon,
  MailIcon,
  WhatsappIcon,
} from '@/components/icons'
import { whatsappLink } from '@/lib/whatsapp'
import type { SiteSettings } from '@/types/product'

interface FooterProps {
  settings: SiteSettings
  productCount: number
  onScrollTo: (id: string) => void
  onSubscribe: (email: string) => void
}

const socialClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white hover:text-[#3B2316]'

export default function Footer({
  settings,
  productCount,
  onScrollTo,
  onSubscribe,
}: FooterProps) {
  const [email, setEmail] = useState('')

  return (
    <footer id="contact" className="border-t border-sand bg-espresso text-[#FFEEDF]">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo.jpg"
                alt="logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border border-white/10 object-cover"
              />
              <div>
                <div className="text-[11px] tracking-[0.3em] text-gold">YOU &amp; ME</div>
                <div className="text-[18px] font-extrabold">COSMETICS 🌸</div>
              </div>
            </div>

            <p className="mt-5 max-w-[45ch] text-[13.5px] leading-6 text-[#FFEEDF]/70">
              هنا تبدأ حكاية جمالك… من رائحة تعبّر عن شخصيتك، إلى لمسة ترطيب تمنحك إحساسًا بالانتعاش
              والثقة 💕
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <div className="mt-6 flex flex-wrap items-center gap-2">
  <a
    href={whatsappLink(settings.whatsappNumber, settings.whatsappMessage)}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-espresso transition hover:bg-[#FFEEDF]"
  >
    <WhatsappIcon className="h-4 w-4" />

    <span>واتساب</span>

    <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
      +{prettyNumber(settings.whatsappNumber).replace(/^\+/, "")}
    </span>
  </a>
</div>

              <div className="flex items-center gap-2">
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className={socialClass}
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                )}
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className={socialClass}
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
                <a href={`mailto:${settings.email}`} aria-label="Email" className={socialClass}>
                  <MailIcon className="h-4 w-4" />
                </a>
              </div>

              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-[12px] font-bold text-[#FFEEDF]/80 transition hover:bg-white/10 hover:text-white"
              >
                <LockIcon className="h-3.5 w-3.5" />
                🔒 دخول المسؤول
              </a>
            </div>

            <div className="mt-4 flex flex-col gap-1 text-[12px] text-[#FFEEDF]/60">
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2 transition hover:text-white"
              >
                <MailIcon className="h-3.5 w-3.5" />
                <span className="ltr">{settings.email}</span>
              </a>
              {(settings.facebookUrl || settings.instagramUrl) && (
                <div className="flex items-center gap-3 text-[11px] opacity-70">
                  {settings.facebookUrl && (
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 transition hover:text-white"
                    >
                      <FacebookIcon className="h-3 w-3" />
                      Facebook
                    </a>
                  )}
                  {settings.instagramUrl && (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 transition hover:text-white"
                    >
                      <InstagramIcon className="h-3 w-3" />
                      Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="text-[14px] font-bold text-white">روابط سريعة</div>
            <div className="mt-4 space-y-2.5 text-[13px] text-[#FFEEDF]/70">
              <button type="button" onClick={() => onScrollTo('shop')} className="block hover:text-white">
                المتجر • {productCount} منتج فاخر
              </button>
              <button type="button" onClick={() => onScrollTo('story')} className="block hover:text-white">
                قصتنا
              </button>
              <div>توصيل سريع في الأردن</div>
              <div>دفع عند الاستلام</div>
            </div>
          </div>

          <div>
            <div className="text-[14px] font-bold text-white">اشتركي بعروض الدلال ✨</div>
            <p className="mt-2 text-[12.5px] text-[#FFEEDF]/60">
              أول من يعرف الخصومات والمنتجات الجديدة
            </p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                if (!email.trim()) return
                onSubscribe(email.trim())
                setEmail('')
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="بريدك الإلكتروني"
                aria-label="بريدك الإلكتروني"
                className="w-full rounded-full bg-white/10 px-4 py-2.5 text-[13px] text-white outline-none ring-1 ring-white/10 placeholder:text-white/40 focus:ring-rose/50"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-rose px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-rose-deep"
              >
                اشتراك
              </button>
            </form>
            <div className="mt-3 text-[11px] text-[#FFEEDF]/40">
              نحترم خصوصيتك، لا رسائل مزعجة. •{' '}
              <span className="ltr">{settings.email}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 md:flex-row">
          <div className="text-center md:text-right">
            <div className="text-[13px] font-bold text-[#FFEEDF]">
              © Ayatasfour، الإمبراطور للابتكار والمهارات
            </div>
            <div className="mt-1 text-[11px] text-[#FFEEDF]/50">
              • {productCount} منتج فاخر • الأردن • عطور ومسك جديد
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#FFEEDF]/50">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            منتجات أصلية • دفع آمن • توصيل سريع • أسعار محمية برقم سري •{' '}
            <span className="ltr">{settings.email}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/** 962777260622 → +962 7 7726 0622 (grouping copied from the original footer). */
function prettyNumber(raw: string) {
  const digits = raw.replace(/[^\d]/g, '')
  const rest = digits.replace(/^962/, '')
  const groups = [rest.slice(0, 1), rest.slice(1, 5), rest.slice(5)]
  return `+962 ${groups.filter(Boolean).join(' ')}`
}
