import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { packages } from '../data/packages'

const CATEGORIES = [
  { key: "NIKAH_PREWEDDING", label: "💍 Nikah + Prewedding", desc: "Paket foto & video lengkap" },
  { key: "WEDDING",          label: "💒 Wedding",             desc: "Dokumentasi hari pernikahan" },
  { key: "ENGAGEMENT",       label: "💑 Engagement",          desc: "Abadikan momen lamaran" },
  { key: "AQIQAH",           label: "🍼 Aqiqah",             desc: "Dokumentasi momen aqiqah" },
  { key: "WISUDA",           label: "🎓 Wisuda",              desc: "Rayakan momen kelulusanmu" },
]

export default function Packages() {
  const [active, setActive] = useState("NIKAH_PREWEDDING")
  const navigate = useNavigate()

  return (
    <div className="min-h-svh bg-dark text-cream pb-24">

      <div className="px-6 pt-10 pb-6">
        <h2 className="text-2xl font-bold tracking-widest uppercase">Paket</h2>
        <p className="text-cream/50 text-xs mt-1">Pilih paket yang sesuai</p>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {CATEGORIES.map(({ key, label, desc }) => {
          const isOpen = active === key
          const catPkgs = packages.filter(p => p.category === key)

          return (
            <div key={key} className={`border rounded-2xl overflow-hidden transition-colors ${isOpen ? 'border-brand/60 bg-brand/10' : 'border-white/10 bg-white/5'}`}>

              {/* Category Header */}
              <button
                onClick={() => setActive(isOpen ? null : key)}
                className="w-full flex items-center justify-between px-5 py-4"
              >
                <div className="text-left">
                  <p className={`text-sm font-bold ${isOpen ? 'text-cream' : 'text-cream/70'}`}>{label}</p>
                  <p className="text-xs text-cream/40 mt-0.5">{desc}</p>
                </div>
                <span className="text-cream/40 text-sm ml-4">{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* Packages */}
              {isOpen && (
                <div className="flex flex-col gap-3 px-4 pb-4">
                  {catPkgs.map(pkg => (
                    <div key={pkg.label} className="bg-dark/60 border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-cream/40 mb-1">{pkg.label}</p>
                      <p className="text-2xl font-bold text-cream mb-3">{pkg.price}</p>
                      <ul className="flex flex-col gap-2 mb-5">
                        {pkg.items.map(item => (
                          <li key={item} className="flex items-start gap-2 text-sm text-cream/70">
                            <span className="text-brand mt-0.5 shrink-0">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => navigate('/booking', { state: { category: key, package: pkg.label } })}
                        className="w-full py-3 rounded-xl bg-brand text-cream text-sm font-bold hover:bg-brand-dark transition-colors"
                      >
                        Pesan Sekarang
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )
        })}
      </div>

    </div>
  )
}
