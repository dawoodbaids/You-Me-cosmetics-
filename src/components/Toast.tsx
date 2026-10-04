'use client'

import { AlertIcon, CheckIcon } from '@/components/icons'

export interface ToastMessage {
  id: number
  text: string
  tone: 'success' | 'error'
}

/** Single floating toast, matching the original `slideUp` animation. */
export default function Toast({ toast }: { toast: ToastMessage | null }) {
  if (!toast) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2">
      <div
        role="status"
        aria-live="polite"
        className="animate-slide-up flex items-center gap-2 rounded-full border border-sand bg-cocoa px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
      >
        {toast.tone === 'error' ? (
          <AlertIcon className="h-4 w-4 text-[#FFB3C6]" />
        ) : (
          <CheckIcon className="h-4 w-4 text-sage" />
        )}
        {toast.text}
      </div>
    </div>
  )
}
