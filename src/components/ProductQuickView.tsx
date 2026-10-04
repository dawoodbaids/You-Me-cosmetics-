'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { BagIcon, CloseIcon, HeartIcon, WhatsappIcon } from '@/components/icons'
import { formatJod } from '@/lib/format'
import { whatsappLink } from '@/lib/whatsapp'
import type { Product, SiteSettings } from '@/types/product'

interface ProductQuickViewProps {
  product: Product | null
  currency: string
  isFavorite: boolean
  settings: SiteSettings
  onClose: () => void
  onToggleFavorite: (productId: string) => void
  onAddToCart: (product: Product, variantId: string | null) => void
}

export default function ProductQuickView({
  product,
  currency,
  isFavorite,
  settings,
  onClose,
  onToggleFavorite,
  onAddToCart,
}: ProductQuickViewProps) {
  useEffect(() => {
    if (!product) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [product, onClose])

  if (!product) return null

  const defaultVariant = product.variants[0] ?? null
  const unitPrice = defaultVariant ? defaultVariant.price : product.price

  const buy = () => {
    onAddToCart(product, defaultVariant?.id ?? null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-espresso/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.nameAr}
        data-testid="product-quickview"
        className="relative max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-[26px] border border-sand bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.25)] md:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-sand bg-white shadow-sm"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-[20px] bg-[#FFFBF8]">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.nameAr}
                width={520}
                height={600}
                className="aspect-[4/4.6] w-full object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
            )}
            {product.badge && (
              <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-extrabold text-rose shadow backdrop-blur">
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="text-[13px] font-bold tracking-widest text-[#B78A4E]">
              {product.categoryLabel}
            </div>
            <h3 className="mt-1 text-[20px] font-extrabold leading-tight">{product.nameAr}</h3>
            <div className="mt-1 text-[12.5px] text-cocoa/50">{product.nameEn}</div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-[22px] font-extrabold text-cocoa">{formatJod(unitPrice, currency)}</span>
              {product.oldPrice && (
                <span className="text-[13px] text-cocoa/40 line-through">
                  {formatJod(product.oldPrice, currency)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-4 text-[13px] leading-6 text-cocoa/75">{product.description}</p>
            )}

            {product.benefits.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {product.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="rounded-full bg-blush px-3 py-1 text-[11px] font-bold text-rose"
                  >
                    {benefit}
                  </li>
                ))}
              </ul>
            )}

            {product.variants.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-[12px] font-bold text-cocoa/70">
                  الأنواع المتاحة ({product.variants.length})
                </div>
                <ul className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <li
                      key={variant.id}
                      className="rounded-full border border-sand bg-[#FFFBF8] px-3 py-1.5 text-[11.5px] font-bold text-cocoa/70"
                    >
                      {variant.label} — {formatJod(variant.price, currency)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={buy}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-cocoa py-3 text-[14px] font-bold text-white transition hover:bg-rose"
              >
                <BagIcon className="h-4 w-4" />
                أضيفي إلى السلة
              </button>

              <button
                type="button"
                onClick={() => onToggleFavorite(product.id)}
                aria-pressed={isFavorite}
                aria-label="المفضلة"
                className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-sand bg-white text-cocoa transition hover:border-rose/40"
              >
                <HeartIcon className={`h-5 w-5 ${isFavorite ? 'fill-rose text-rose' : ''}`} />
              </button>

              <a
                href={whatsappLink(
                  settings.whatsappNumber,
                  `${settings.whatsappMessage}\n${product.nameAr} — ${formatJod(unitPrice, settings.currency)}`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="اسألي عن هذا المنتج على واتساب"
                className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-whatsapp text-white shadow"
              >
                <WhatsappIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
