import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Booking() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [wa, setWa] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !wa.trim()) return
    setLoading(true)

    await supabase.from('bookings').insert({
      name: name.trim(),
      whatsapp: wa.trim(),
      event_type: state?.category || '',
      package: state?.package || '',
      status: 'pending',
    })

    const msg = `Halo Mizwar Films, saya ${name} ingin memesan paket *${state?.package}* (${state?.category}). Nomor WA saya: ${wa}`
    window.open(`https://wa.me/6282213723022?text=${encodeURIComponent(msg)}`, '_blank')
    setLoading(false)
  }

  return (
    <div className="min-h-svh bg-dark text-cream flex flex-col px-6 py-10">

      {/* Back */}
      <button onClick={() => navigate(-1)} className="text-cream/50 text-sm mb-8 flex items-center gap-2">
        ← Kembali
      </button>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Mau pesan? 👋</h2>
        <p className="text-cream/50 text-sm">Isi data kamu, kami langsung hubungi via WhatsApp.</p>
      </div>

      {/* Selected Package */}
      {state && (
        <div className="bg-brand/20 border border-brand/40 rounded-2xl px-4 py-4 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand/30 flex items-center justify-center text-lg shrink-0">📦</div>
          <div>
            <p className="text-xs text-cream/50 mb-0.5">{state.category}</p>
            <p className="text-sm font-bold">{state.package}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Nama kamu</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Contoh: Siti Rahma"
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm outline-none focus:border-brand transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Nomor WhatsApp</label>
          <input
            type="tel"
            value={wa}
            onChange={e => setWa(e.target.value)}
            placeholder="Contoh: 08123456789"
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm outline-none focus:border-brand transition-colors"
          />
        </div>

        <p className="text-xs text-cream/30 text-center">
          Setelah kirim, WhatsApp akan terbuka otomatis 💬
        </p>

        <button
          type="submit"
          disabled={!name.trim() || !wa.trim() || loading}
          className="w-full py-4 rounded-2xl bg-brand text-cream text-base font-bold disabled:opacity-40 transition-colors"
        >
          {loading ? 'Mengirim...' : '💬 Kirim via WhatsApp'}
        </button>

      </form>
    </div>
  )
}
