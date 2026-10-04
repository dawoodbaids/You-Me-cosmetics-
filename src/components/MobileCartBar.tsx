'use client'

import { BagIcon, WhatsappIcon } from '@/components/icons'
import { formatJod } from '@/lib/format'
import { whatsappLink } from '@/lib/whatsapp'
import type { SiteSettings } from '@/types/product'

interface MobileCartBarProps {
  count: number
  total: number
  settings: SiteSettings
  onOpenCart: () => void
}

export default function MobileCartBar({ count, total, settings, onOpenCart }: MobileCartBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-sand bg-white/95 p-3 backdrop-blur-xl md:hidden">
      <div className="flex items-center gap-3 pb-[env(safe-area-inset-bottom)]">
        <button
          type="button"
          onClick={onOpenCart}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cocoa py-3 text-[14px] font-bold text-white"
        >
          <BagIcon className="h-4 w-4" />
          السلة {count > 0 ? `• ${formatJod(total, settings.currency)}` : ''}
        </button>
        <a
          href={whatsappLink(settings.whatsappNumber, settings.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصلي عبر واتساب"
          className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-whatsapp text-white shadow"
        >
          <WhatsappIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  )
}
