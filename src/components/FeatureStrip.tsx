import { CardIcon, ShieldIcon, TruckIcon } from '@/components/icons'

const ITEMS = [
  { icon: TruckIcon, title: 'توصيل سريع في الأردن', sub: 'خلال 24-48 ساعة' },
  { icon: ShieldIcon, title: 'منتجات أصلية 100%', sub: 'مختارة بعناية' },
  { icon: CardIcon, title: 'دفع عند الاستلام', sub: 'آمن وسهل' },
]

export default function FeatureStrip() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 md:px-8">
      <div className="grid grid-cols-1 gap-3 rounded-[24px] border border-sand bg-white/70 p-3 backdrop-blur-xl md:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 rounded-[18px] bg-white px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush text-rose">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[14px] font-bold">{title}</div>
              <div className="text-[12px] text-cocoa/60">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
