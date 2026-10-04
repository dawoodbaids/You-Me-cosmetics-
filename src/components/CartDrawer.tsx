'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { BagIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon, WhatsappIcon } from '@/components/icons'
import { formatJod } from '@/lib/format'
import type { CartLine, SiteSettings } from '@/types/product'

interface CartDrawerProps {
  open: boolean
  lines: CartLine[]
  settings: SiteSettings
  onClose: () => void
  onIncrement: (productId: string, variantId: string | null) => void
  onDecrement: (productId: string, variantId: string | null) => void
  onRemove: (productId: string, variantId: string | null) => void
  onCheckout: () => void
  onBrowse: () => void
}

export default function CartDrawer({
  open,
  lines,
  settings,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
  onBrowse,
}: CartDrawerProps) {
  const currency = settings.currency
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0)

  // Keep the page behind the drawer from scrolling.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-[60] transition ${open ? 'visible' : 'invisible'}`}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-espresso/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="سلة التسوق"
        data-testid="cart-drawer"
        className={`absolute left-0 top-0 flex h-full w-[94%] max-w-[420px] flex-col bg-[#FFFDFB] shadow-[-20px_0_60px_rgba(0,0,0,0.15)] transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-sand p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cocoa text-white">
              <BagIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[16px] font-bold">سلة التسوق</div>
              <div className="text-[12px] text-cocoa/50">{count} منتجات</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق السلة"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-sand bg-white"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blush">
                <BagIcon className="h-8 w-8 text-rose/50" />
              </div>
              <div className="text-[15px] font-bold">سلتك فارغة الآن</div>
              <div className="text-[12px] text-cocoa/50">أضيفي لمسة جمال تشبهك</div>
              <button
                type="button"
                onClick={onBrowse}
                className="rounded-full bg-cocoa px-6 py-2.5 text-[13px] font-bold text-white"
              >
                تسوقي الآن
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map((line) => {
                const key = `${line.product.id}-${line.variant?.id ?? 'base'}`
                return (
                  <li
                    key={key}
                    className="flex gap-3 rounded-[18px] border border-sand bg-white p-3"
                  >
                    {line.product.imageUrl ? (
                      <Image
                        src={line.product.imageUrl}
                        alt=""
                        width={64}
                        height={64}
                        className="h-[64px] w-[64px] rounded-[14px] object-cover"
                      />
                    ) : (
                      <div className="h-[64px] w-[64px] rounded-[14px] bg-blush" />
                    )}

                    <div className="flex-1">
                      <div className="line-clamp-1 text-[13px] font-bold">{line.product.nameAr}</div>
                      {line.variant && (
                        <div className="text-[11px] text-cocoa/60">{line.variant.label}</div>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-sand bg-[#FFFBF8] px-1">
                          <button
                            type="button"
                            onClick={() => onDecrement(line.product.id, line.variant?.id ?? null)}
                            aria-label="إنقاص الكمية"
                            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white"
                          >
                            <MinusIcon className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-[12px] font-bold">{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onIncrement(line.product.id, line.variant?.id ?? null)}
                            aria-label="زيادة الكمية"
                            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white"
                          >
                            <PlusIcon className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="text-[13px] font-bold">{formatJod(line.lineTotal, currency)}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemove(line.product.id, line.variant?.id ?? null)}
                      aria-label="حذف المنتج"
                      className="h-7 w-7 self-center rounded-full bg-blush text-rose transition hover:bg-rose hover:text-white"
                    >
                      <TrashIcon className="mx-auto h-3.5 w-3.5" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-sand bg-white p-5">
            <div className="flex items-center justify-between text-[13px] text-cocoa/60">
              <span>المجموع المؤقت</span>
              <span>{formatJod(total, currency)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[16px] font-extrabold">
              <span>الإجمالي</span>
              <span>{formatJod(total, currency)}</span>
            </div>

            {settings.storeFreeShippingThreshold > 0 && total < settings.storeFreeShippingThreshold && (
              <p className="mt-2 text-[11.5px] text-cocoa/55">
                أضيفي {formatJod(settings.storeFreeShippingThreshold - total, currency)} للحصول على
                توصيل مجاني.
              </p>
            )}

            <button
              type="button"
              onClick={onCheckout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp py-3.5 text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(37,211,102,0.3)] transition hover:brightness-105"
            >
              <WhatsappIcon className="h-5 w-5" />
              إتمام الطلب عبر واتساب
            </button>
            <p className="mt-2 text-center text-[11px] text-cocoa/50">
              سيتم فتح واتساب برسالة طلبك الجاهزة
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}
