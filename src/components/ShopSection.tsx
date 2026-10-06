'use client'

import { HeartIcon } from '@/components/icons'
import styles from './Hero.module.css'
import { CATEGORY_FILTERS } from '@/lib/categories'
import type { CategoryFilter } from '@/types/product'
import ProductCard from '@/components/ProductCard'

interface ShopSectionProps {
  products: import('@/types/product').Product[]
  currency: string
  activeFilter: CategoryFilter
  onFilterChange: (filter: CategoryFilter) => void
  favorites: string[]
  selectedVariants: Record<string, string>
  onSelectVariant: (productId: string, variantId: string) => void
  onToggleFavorite: (productId: string) => void
  onAddToCart: (productId: string, variantId: string | null) => void
  onOpenDetails: (productId: string) => void
}

export default function ShopSection({
  products,
  currency,
  activeFilter,
  onFilterChange,
  favorites,
  selectedVariants,
  onSelectVariant,
  onToggleFavorite,
  onAddToCart,
  onOpenDetails,
}: ShopSectionProps) {
  const favoriteSet = new Set(favorites)

  return (
    <section id="shop" className="mx-auto max-w-[1280px] px-4 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className={styles.sectionIntro}>
          <div className={styles.introOrnament}><HeartIcon /></div>
          <p>منتجات مختارة لك</p>
          <h2>الأكثر <span>طلباً</span></h2>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="تصفية حسب الفئة">
          {CATEGORY_FILTERS.map((option) => (
            <button
              key={option.key}
              type="button"
              data-testid={`filter-${option.key}`}
              onClick={() => onFilterChange(option.key)}
              aria-pressed={activeFilter === option.key}
              className={`rounded-full border px-5 py-2.5 text-[13.5px] font-bold transition ${
                activeFilter === option.key
                  ? 'border-cocoa bg-cocoa text-white shadow'
                  : 'border-sand bg-white text-cocoa/70 hover:border-rose/30 hover:text-cocoa'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="mt-12 text-center text-[14px] text-cocoa/60">
          لا توجد منتجات في هذه الفئة حالياً.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              isFavorite={favoriteSet.has(product.id)}
              selectedVariantId={selectedVariants[product.id] ?? product.variants[0]?.id ?? null}
              onSelectVariant={onSelectVariant}
              onToggleFavorite={onToggleFavorite}
              onAddToCart={onAddToCart}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </section>
  )
}
