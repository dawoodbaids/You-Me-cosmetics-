'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Backdrop from '@/components/Backdrop'
import CartDrawer from '@/components/CartDrawer'
import FeatureStrip from '@/components/FeatureStrip'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import MobileCartBar from '@/components/MobileCartBar'
import ProductQuickView from '@/components/ProductQuickView'
import ShopSection from '@/components/ShopSection'
import StorySection from '@/components/StorySection'
import Testimonials from '@/components/Testimonials'
import Toast, { type ToastMessage } from '@/components/Toast'
import { cartCount as countItems, cartTotal as sumTotal, resolveCart } from '@/lib/cart'
import { filterProducts } from '@/lib/categories'
import { useCartStore, useFavoritesStore } from '@/lib/stores'
import { buildOrderMessage, whatsappLink } from '@/lib/whatsapp'
import type { CategoryFilter, Product, SiteSettings } from '@/types/product'

const SECTION_LABELS: Record<string, string> = {
  home: 'الرئيسية',
  shop: 'المتجر',
  story: 'قصتنا',
  contact: 'تواصل',
}

interface StorefrontProps {
  products: Product[]
  settings: SiteSettings
}

export default function Storefront({ products, settings }: StorefrontProps) {
  const [filter, setFilter] = useState<CategoryFilter>('all')
  const [variantChoice, setVariantChoice] = useState<Record<string, string>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [quickViewId, setQuickViewId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [cart, cartActions] = useCartStore()
  const [favorites, toggleFavoriteStore] = useFavoritesStore()

  /* ------------------------------------------------------------------ toast */

  const notify = useCallback((text: string, tone: ToastMessage['tone'] = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), text, tone })
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }, [])

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    },
    [],
  )

  /* ------------------------------------------------------------------- cart */

  // Lines are always derived from the freshly loaded catalogue, so prices come
  // from Supabase and products deactivated since the last visit drop out.
  const lines = useMemo(() => resolveCart(cart, products), [cart, products])
  const totalCount = useMemo(() => countItems(lines), [lines])
  const total = useMemo(() => sumTotal(lines), [lines])

  const addProduct = useCallback(
    (productId: string, variantId: string | null) => {
      const product = products.find((candidate) => candidate.id === productId)
      cartActions.add(productId, variantId)
      if (product) notify(`أضيف إلى السلة: ${product.nameAr}`)
    },
    [cartActions, notify, products],
  )

  const increment = useCallback(
    (productId: string, variantId: string | null) => {
      const line = lines.find(
        (candidate) =>
          candidate.product.id === productId && (candidate.variant?.id ?? null) === variantId,
      )
      if (!line) return
      if (line.quantity >= 99) return
      cartActions.setQuantity(productId, variantId, line.quantity + 1)
    },
    [cartActions, lines],
  )

  const decrement = useCallback(
    (productId: string, variantId: string | null) => {
      const line = lines.find(
        (candidate) =>
          candidate.product.id === productId && (candidate.variant?.id ?? null) === variantId,
      )
      if (!line) return
      if (line.quantity <= 1) {
        cartActions.remove(productId, variantId)
        return
      }
      cartActions.setQuantity(productId, variantId, line.quantity - 1)
    },
    [cartActions, lines],
  )

  const remove = useCallback(
    (productId: string, variantId: string | null) => {
      cartActions.remove(productId, variantId)
      notify('تم حذف المنتج من السلة')
    },
    [cartActions, notify],
  )

  /* -------------------------------------------------------------- favourites */

  const toggleFavorite = useCallback(
    (productId: string) => {
      notify(toggleFavoriteStore(productId) ? 'أُضيف إلى المفضلة' : 'أُزيل من المفضلة')
    },
    [notify, toggleFavoriteStore],
  )

  /* ----------------------------------------------------------------- scroll */

  const scrollTo = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, '', `#${id}`)
      notify(`الانتقال إلى ${SECTION_LABELS[id] ?? id} ✅`)
    },
    [notify],
  )

  /* --------------------------------------------------------------- checkout */

  const checkout = useCallback(() => {
    if (lines.length === 0) return
    const message = buildOrderMessage(lines, settings)
    window.open(whatsappLink(settings.whatsappNumber, message), '_blank', 'noopener,noreferrer')
    notify('تم فتح واتساب برسالة طلبك ✅')
  }, [lines, notify, settings])

  const browse = useCallback(() => {
    setCartOpen(false)
    scrollTo('shop')
  }, [scrollTo])

  /* ----------------------------------------------------------------- render */

  const visible = useMemo(() => filterProducts(products, filter), [products, filter])
  const quickViewProduct = products.find((product) => product.id === quickViewId) ?? null
  const favoriteSet = useMemo(() => new Set(favorites), [favorites])

  return (
    <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">
      <Backdrop />

      <Header
        settings={settings}
        cartCount={totalCount}
        favoriteCount={favorites.length}
        onOpenCart={() => setCartOpen(true)}
        onScrollTo={scrollTo}
      />

      <main>
        <Hero settings={settings} productCount={products.length} onScrollTo={scrollTo} />
        <FeatureStrip />

        <ShopSection
          products={visible}
          currency={settings.currency}
          activeFilter={filter}
          onFilterChange={setFilter}
          favorites={favorites}
          selectedVariants={variantChoice}
          onSelectVariant={(productId, variantId) =>
            setVariantChoice((current) => ({ ...current, [productId]: variantId }))
          }
          onToggleFavorite={toggleFavorite}
          onAddToCart={addProduct}
          onOpenDetails={setQuickViewId}
        />

        <StorySection productCount={products.length} />
        <Testimonials />
      </main>

      <Footer
        settings={settings}
        productCount={products.length}
        onScrollTo={scrollTo}
        onSubscribe={() => notify('تم تسجيل بريدك! سنتواصل قريباً 🌷')}
      />

      <CartDrawer
        open={cartOpen}
        lines={lines}
        settings={settings}
        onClose={() => setCartOpen(false)}
        onIncrement={increment}
        onDecrement={decrement}
        onRemove={remove}
        onCheckout={checkout}
        onBrowse={browse}
      />

      <ProductQuickView
        product={quickViewProduct}
        currency={settings.currency}
        isFavorite={quickViewProduct ? favoriteSet.has(quickViewProduct.id) : false}
        settings={settings}
        onClose={() => setQuickViewId(null)}
        onToggleFavorite={toggleFavorite}
        onAddToCart={(product, variantId) => addProduct(product.id, variantId)}
      />

      <MobileCartBar
        count={totalCount}
        total={total}
        settings={settings}
        onOpenCart={() => setCartOpen(true)}
      />

      <Toast toast={toast} />
    </div>
  )
}
