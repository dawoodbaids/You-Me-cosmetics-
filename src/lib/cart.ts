import { formatJod } from '@/lib/format'
import type { CartItem, CartLine, Product } from '@/types/product'

export const CART_STORAGE_KEY = 'you-and-me-cart-v1'

/**
 * Joins the stored cart (product id + variant id + quantity only) against the
 * freshly loaded catalogue so every price on screen comes from the database.
 * Lines whose product or variant disappeared are dropped.
 */
export function resolveCart(items: CartItem[], products: Product[]): CartLine[] {
  const byId = new Map(products.map((product) => [product.id, product]))

  const lines: CartLine[] = []

  for (const item of items) {
    const product = byId.get(item.productId)
    if (!product) continue

    const variant = item.variantId
      ? (product.variants.find((candidate) => candidate.id === item.variantId) ?? null)
      : null

    // A stale variant id must not silently fall back to the base price.
    if (item.variantId && !variant) continue

    const quantity = Math.max(1, Math.floor(item.quantity) || 1)
    const unitPrice = variant ? variant.price : product.price

    lines.push({ product, variant, quantity, unitPrice, lineTotal: unitPrice * quantity })
  }

  return lines
}

export const cartCount = (lines: CartLine[]) =>
  lines.reduce((sum, line) => sum + line.quantity, 0)

export const cartTotal = (lines: CartLine[]) =>
  lines.reduce((sum, line) => sum + line.lineTotal, 0)

/** Adds a line, merging with an identical product+variant pair. */
export function addToCart(items: CartItem[], productId: string, variantId: string | null, quantity = 1) {
  const index = items.findIndex(
    (item) => item.productId === productId && item.variantId === variantId,
  )

  if (index === -1) return [...items, { productId, variantId, quantity }]

  const next = [...items]
  next[index] = { ...next[index], quantity: next[index].quantity + quantity }
  return next
}

export function setCartQuantity(items: CartItem[], productId: string, variantId: string | null, quantity: number) {
  return items.map((item) =>
    item.productId === productId && item.variantId === variantId
      ? { ...item, quantity: Math.max(1, quantity) }
      : item,
  )
}

export function removeFromCart(items: CartItem[], productId: string, variantId: string | null) {
  return items.filter((item) => !(item.productId === productId && item.variantId === variantId))
}

/** Reads persisted cart state, tolerating corrupt/older payloads. */
export function readStoredCart(storage: Pick<Storage, 'getItem'>): CartItem[] {
  try {
    const raw = storage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.flatMap((entry) => {
      if (!entry || typeof entry !== 'object') return []
      const { productId, variantId, quantity } = entry as Partial<CartItem>
      if (typeof productId !== 'string' || !productId) return []
      return [
        {
          productId,
          variantId: typeof variantId === 'string' && variantId ? variantId : null,
          quantity: typeof quantity === 'number' && quantity > 0 ? Math.floor(quantity) : 1,
        },
      ]
    })
  } catch {
    return []
  }
}

export function writeStoredCart(storage: Pick<Storage, 'setItem'>, items: CartItem[]) {
  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Private mode / quota — the cart simply will not persist.
  }
}

const FAVORITES_STORAGE_KEY = 'you-and-me-favorites-v1'

export function readStoredFavorites(storage: Pick<Storage, 'getItem'>): string[] {
  try {
    const raw = storage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function writeStoredFavorites(storage: Pick<Storage, 'setItem'>, ids: string[]) {
  try {
    storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Ignore — favourites are a convenience.
  }
}

export const describeLine = (line: CartLine, currency: string) =>
  `${formatJod(line.unitPrice, currency)} × ${line.quantity} = ${formatJod(line.lineTotal, currency)}`
