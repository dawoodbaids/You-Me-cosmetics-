import Image from 'next/image'
import { HeartIcon } from '@/components/icons'

export default function StorySection({ productCount }: { productCount: number }) {
  const stats = [
    { value: `+${productCount}`, label: 'منتجات مختارة' },
    { value: '100%', label: 'أصلي وآمن' },
    { value: '24h', label: 'رد سريع واتساب' },
  ]

  return (
    <section id="story" className="relative mx-auto max-w-[1280px] px-4 md:px-8">
      <div className="relative overflow-hidden rounded-[32px] border border-sand bg-gradient-to-br from-white via-[#FFF8F2] to-[#FFE8DE] p-8 md:p-14">
        <div
          aria-hidden
          className="absolute -bottom-20 -right-20 h-[300px] w-[300px] rounded-full bg-gold/15 blur-[40px]"
        />

        <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[12px] font-bold text-rose shadow-sm">
              <HeartIcon className="h-4 w-4" />
              قصتنا
            </div>

            <h2 className="mt-5 text-[28px] font-extrabold leading-[1.25] md:text-[38px]">
              You &amp; Me Cosmetics…
              <br />
              <span className="font-medium text-cocoa/70">لأن جمالك قصة، ونحن نهتم بتفاصيلها.</span>
            </h2>

            <p className="mt-5 max-w-[55ch] text-[15px] leading-7 text-cocoa/70">
              بدأنا بشغف بسيط: أن تجد كل سيدة المنتج الذي يشبهها فعلاً. نختار منتجات عناية ومكياج
              بتركيبات لطيفة، روائح تأخذك لعالم ثاني، وأسعار تناسب يومك.
            </p>

            <div className="mt-7 grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[18px] bg-white/80 p-4 shadow-sm backdrop-blur">
                  <div className="text-[20px] font-extrabold text-rose">{stat.value}</div>
                  <div className="text-[12px] text-cocoa/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-[420px] rounded-[28px] border border-white bg-white p-3 shadow-[0_24px_60px_rgba(74,46,42,0.12)]">
              <div className="grid grid-cols-2 gap-3">
                <Image
                  src="/products/rose-water.png"
                  alt="ماء الورد"
                  width={300}
                  height={300}
                  className="h-[160px] w-full rounded-[18px] object-cover"
                />
                <Image
                  src="/products/aloe-gel.png"
                  alt="جل الألوفيرا"
                  width={300}
                  height={300}
                  className="h-[160px] w-full rounded-[18px] object-cover"
                />
                <Image
                  src="/products/primer.png"
                  alt="برايمر"
                  width={600}
                  height={340}
                  className="col-span-2 h-[180px] w-full rounded-[18px] object-cover"
                />
              </div>
              <div className="absolute -left-4 -top-4 rounded-full bg-sage px-4 py-2 text-[11px] font-bold text-white shadow">
                طبيعي 99%
              </div>
              <div className="absolute -right-3 bottom-10 rounded-full bg-white px-4 py-2 text-[11px] font-bold shadow">
                صنع بحب في الأردن 🌸
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
