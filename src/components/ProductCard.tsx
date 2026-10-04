'use client'

import Image from 'next/image'
import { BagIcon, HeartIcon } from '@/components/icons'
import { formatJod } from '@/lib/format'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  currency: string
  isFavorite: boolean
  selectedVariantId: string | null
  onSelectVariant: (productId: string, variantId: string) => void
  onToggleFavorite: (productId: string) => void
  onAddToCart: (productId: string, variantId: string | null) => void
  onOpenDetails: (productId: string) => void
}

export default function ProductCard({
  product,
  currency,
  isFavorite,
  selectedVariantId,
  onSelectVariant,
  onToggleFavorite,
  onAddToCart,
  onOpenDetails,
}: ProductCardProps) {
  const isPackage = product.category === 'packages'
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0] ?? null
  const unitPrice = selectedVariant ? selectedVariant.price : product.price

  return (
    <article
      data-testid={`product-${product.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-[26px] bg-white transition hover:shadow-[0_18px_50px_rgba(74,46,42,0.12)] ${
        isPackage
          ? 'border-2 border-gold/70 shadow-[0_16px_50px_rgba(201,168,106,0.22)]'
          : 'border border-sand shadow-[0_8px_30px_rgba(74,46,42,0.04)]'
      }`}
    >
      {isPackage && (
        <div className="absolute inset-x-0 top-0 z-10 h-[5px] bg-gradient-to-r from-gold via-[#E9D5A8] to-gold" />
      )}

      <div className={`relative overflow-hidden ${isPackage ? 'bg-[#FFFCF5]' : 'bg-[#FFFBF8]'}`}>
        <button
          type="button"
          onClick={() => onOpenDetails(product.id)}
          aria-label={`عرض تفاصيل ${product.nameAr}`}
          className="block w-full"
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.nameAr}
              width={600}
              height={690}
              className={`aspect-[4/4.6] w-full object-cover transition duration-700 group-hover:scale-[1.04] ${
                isPackage ? 'aspect-[4/3.2]' : ''
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex aspect-[4/4.6] w-full items-center justify-center text-[12px] text-cocoa/40">
              لا توجد صورة
            </div>
          )}
        </button>

        {product.badge && (
          <div
            className={`absolute right-3 top-3 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold shadow backdrop-blur ${
              isPackage
                ? 'border border-white/30 bg-gradient-to-r from-gold to-[#E8C99A] text-white'
                : 'bg-white/90 text-rose'
            }`}
          >
            {product.badge}
          </div>
        )}

        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur transition hover:bg-white"
        >
          <HeartIcon className={`h-4 w-4 ${isFavorite ? 'fill-rose text-rose' : 'text-cocoa/50'}`} />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
          {product.benefits.slice(0, isPackage ? 4 : 3).map((benefit) => (
            <span
              key={benefit}
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur ${
                isPackage
                  ? 'border border-gold/30 bg-espresso/90 text-[#FFE8C2]'
                  : 'bg-white/90 text-cocoa/70'
              }`}
            >
              {benefit}
            </span>
          ))}
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${isPackage ? 'p-5' : 'p-4'}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div
              className={`font-medium ${
                isPackage
                  ? 'text-[12px] font-bold tracking-widest text-gold'
                  : 'text-[13px] text-[#B78A4E]'
              }`}
            >
              {product.categoryLabel}
            </div>
            <h3
              className={`mt-1 font-bold leading-tight ${
                isPackage ? 'line-clamp-2 text-[17px]' : 'line-clamp-1 text-[15.5px]'
              }`}
            >
              {product.nameAr}
            </h3>
            <div className="text-[12px] text-cocoa/50">{product.nameEn}</div>
          </div>

          <div className="shrink-0 text-left">
            <div className={`${isPackage ? 'text-[18px]' : 'text-[16px]'} font-extrabold text-cocoa`}>
              {formatJod(unitPrice, currency)}
            </div>
            {product.oldPrice && (
              <div className="text-[11px] text-cocoa/40 line-through">
                {formatJod(product.oldPrice, currency)}
              </div>
            )}
            {isPackage && product.oldPrice && (
              <div className="mt-1 inline-flex rounded-full bg-[#E8F5E0] px-2 py-0.5 text-[10px] font-bold text-[#5A8A4A]">
                توفير {(product.oldPrice - unitPrice).toFixed(0)} JOD
              </div>
            )}
          </div>
        </div>

        {product.description && (
          <p
            className={`mt-3 leading-5 text-cocoa/70 ${
              isPackage ? 'line-clamp-3 text-[12.5px]' : 'line-clamp-2 text-[12.5px] text-cocoa/60'
            }`}
          >
            {product.description}
          </p>
        )}

        {product.variants.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const isSelected = variant.id === selectedVariant?.id
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onSelectVariant(product.id, variant.id)}
                  aria-pressed={isSelected}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-bold transition ${
                    isSelected
                      ? 'border-rose bg-blush text-rose'
                      : 'border-sand bg-white text-cocoa/60 hover:border-rose/40'
                  }`}
                >
                  {variant.label}
                </button>
              )
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => onAddToCart(product.id, selectedVariant?.id ?? null)}
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full text-[13.5px] font-bold text-white shadow-[0_8px_20px_rgba(74,46,42,0.15)] transition active:scale-[0.98] ${
            isPackage
              ? 'bg-gradient-to-r from-cocoa to-[#7A4A3A] py-3.5 hover:from-gold hover:to-[#E8C99A] hover:text-espresso'
              : 'bg-cocoa py-3 hover:bg-rose'
          }`}
        >
          <BagIcon className="h-4 w-4" />
          {isPackage ? 'أضيفي الباكيج للسلة ✨' : 'أضيفي إلى السلة'}
        </button>
      </div>
    </article>
  )
}
