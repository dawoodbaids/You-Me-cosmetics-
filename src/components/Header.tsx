'use client'

import Image from 'next/image'
import { BagIcon, FacebookIcon, HeartIcon, InstagramIcon, WhatsappIcon } from '@/components/icons'
import { whatsappLink } from '@/lib/whatsapp'
import type { SiteSettings } from '@/types/product'

const NAV = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'shop', label: 'المتجر' },
  { id: 'story', label: 'قصتنا' },
  { id: 'contact', label: 'تواصل' },
] as const

interface HeaderProps {
  settings: SiteSettings
  cartCount: number
  favoriteCount: number
  onOpenCart: () => void
  onScrollTo: (id: string) => void
}

export default function Header({
  settings,
  cartCount,
  favoriteCount,
  onOpenCart,
  onScrollTo,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 overflow-x-hidden border-b border-sand/80 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onScrollTo('home')}
            className="flex items-center gap-3"
            aria-label="الصفحة الرئيسية"
          >
            <span className="h-11 w-11 overflow-hidden rounded-full border border-sand bg-white shadow-sm">
              <Image
                src="/brand/logo.jpg"
                alt="You &amp; Me"
                width={44}
                height={44}
                className="h-full w-full object-cover"
                priority
              />
            </span>
            <span className="hidden text-right leading-none sm:block">
              <span className="block text-[11px] tracking-[0.25em] text-[#B78A4E]">YOU &amp; ME</span>
              <span className="block text-[17px] font-extrabold tracking-wide text-cocoa">
                COSMETICS
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                data-testid={`nav-${item.id}`}
                onClick={() => onScrollTo(item.id)}
                className="text-[14.5px] font-medium text-cocoa/70 transition hover:text-cocoa"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="سلة التسوق"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-white shadow-sm transition hover:shadow"
          >
            <BagIcon className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onScrollTo('shop')}
            aria-label="المفضلة"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-white shadow-sm"
          >
            <HeartIcon
              className={`h-[18px] w-[18px] ${favoriteCount > 0 ? 'fill-rose text-rose' : ''}`}
            />
            {favoriteCount > 0 && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-rose" />
            )}
          </button>

          <div className="hidden items-center gap-2 md:flex">
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-white shadow-sm transition hover:shadow text-cocoa/70 hover:text-[#1877F2]"
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
                className="flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-white shadow-sm transition hover:shadow text-cocoa/70 hover:text-rose"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            )}
          </div>

          <a
            href={whatsappLink(settings.whatsappNumber, settings.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-cocoa px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(74,46,42,0.2)] transition hover:bg-rose md:flex"
          >
            <WhatsappIcon className="h-4 w-4" />
            واتساب
          </a>
        </div>
      </div>
    </header>
  )
}
