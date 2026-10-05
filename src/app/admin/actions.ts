'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export interface ActionResult {
  ok: boolean
  message: string
}

const SETTING_KEYS = [
  'whatsapp_number',
  'whatsapp_message',
  'email',
  'instagram_url',
  'facebook_url',
  'currency',
  'store_tagline',
  'store_announcement',
  'store_free_shipping_threshold',
] as const

export type SettingsPayload = Record<(typeof SETTING_KEYS)[number], string>

/* ------------------------------------------------------------------- auth */

export async function signIn(email: string, password: string): Promise<ActionResult> {
  const cleanEmail = email.trim()
  if (!cleanEmail || !password) return { ok: false, message: 'أدخلي البريد الإلكتروني وكلمة السر.' }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
  if (error) return { ok: false, message: 'بيانات الدخول غير صحيحة.' }

  // Authentication alone is not authorisation.
  if (!(await isAdmin())) {
    await supabase.auth.signOut()
    return { ok: false, message: 'هذا الحساب ليس حساب مسؤول.' }
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/admin/login')
}

/* --------------------------------------------------------------- catalogue */

export interface ProductPricePayload {
  productId: string
  updatedAt: string
  price: number
  oldPrice: number | null
  /** Variant id → new price. Only the ones present are written. */
  variantPrices: Record<string, number>
}

const MAX_PRICE = 100_000

export async function saveProductPrices(payload: ProductPricePayload): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, message: 'غير مصرّح — سجّلي الدخول كمسؤول.' }

  const { productId, updatedAt, price, oldPrice, variantPrices } = payload
  if (!productId) return { ok: false, message: 'معرّف المنتج مفقود.' }

  if (!Number.isFinite(price) || price < 0 || price > MAX_PRICE) {
    return { ok: false, message: 'السعر غير صالح.' }
  }
  if (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice < price || oldPrice > MAX_PRICE)) {
    return { ok: false, message: 'السعر القديم يجب أن يكون أكبر من السعر الحالي أو فارغاً.' }
  }

  const entries = Object.entries(variantPrices)
  for (const [, variantPrice] of entries) {
    if (!Number.isFinite(variantPrice) || variantPrice < 0 || variantPrice > MAX_PRICE) {
      return { ok: false, message: 'أحد أسعار الأنواع غير صالح.' }
    }
  }

  const supabase = await createClient()

  const { error: productError } = await supabase.rpc('admin_save_product_prices', {
    p_id: productId,
    p_price: price,
    p_old_price: oldPrice,
    p_variants: variantPrices,
    p_expected_updated_at: updatedAt,
  })

  if (productError) return { ok: false, message: `تعذّر حفظ سعر المنتج: ${productError.message}` }

  revalidatePath('/')
  revalidatePath('/admin')

  const count = entries.length
  return {
    ok: true,
    message: count > 0 ? `تم حفظ السعر و${count} من الأنواع ✅` : 'تم حفظ السعر ✅',
  }
}

export async function setProductFlags(
  productId: string,
  patch: { is_active?: boolean; is_featured?: boolean },
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, message: 'غير مصرّح.' }
  if (!productId) return { ok: false, message: 'معرّف المنتج مفقود.' }

  const supabase = await createClient()
  const flags: { is_active?: boolean; is_featured?: boolean } = {}
  if (typeof patch.is_active === 'boolean') flags.is_active = patch.is_active
  if (typeof patch.is_featured === 'boolean') flags.is_featured = patch.is_featured
  if (!Object.keys(flags).length) return { ok: false, message: 'اختاري الحالة المطلوبة.' }
  const { error } = await supabase.from('products').update(flags).eq('id', productId).select('id').single()
  if (error) return { ok: false, message: error.message }

  revalidatePath('/')
  revalidatePath('/admin')
  return { ok: true, message: 'تم التحديث ✅' }
}

export async function saveSettings(payload: SettingsPayload): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, message: 'غير مصرّح — سجّلي الدخول كمسؤول.' }

  const rows = SETTING_KEYS.map((key) => ({ key, value: String(payload[key] ?? '').trim() }))

  const whatsapp = rows.find((row) => row.key === 'whatsapp_number')?.value ?? ''
  if (whatsapp && !/^\d{6,15}$/.test(whatsapp.replace(/\D/g, '').slice(0, 15))) {
    return { ok: false, message: 'رقم واتساب غير صالح — أرقام فقط مع رمز الدولة.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
  if (error) return { ok: false, message: `تعذّر حفظ الإعدادات: ${error.message}` }

  revalidatePath('/')
  revalidatePath('/admin')
  return { ok: true, message: 'تم حفظ الإعدادات ✅' }
}
