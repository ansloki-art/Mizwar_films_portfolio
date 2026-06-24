import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useSite } from '../context/SiteContext'
import BookingCalendar from '../components/BookingCalendar'

export default function Booking() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { contact } = useSite()

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !location.trim() || !date) return
    setLoading(true)

    await supabase.from('bookings').insert({
      name: name.trim(),
      event_type: state?.category || '',
      package: state?.package || '',
      status: 'pending',
    })

    const msg = `Halo Mizwar Films, saya *${name}* dari *${location}* ingin memesan paket *${state?.package}* (${state?.category}) pada tanggal *${date}*.`
    window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
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
        <div className="bg-brand/20 border border-brand/40 rounded-2xl px-4 py-4 mb-6 flex items-center gap-3">
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
          <label className="text-sm font-semibold">Lokasi acara</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Contoh: Lhokseumawe, Aceh"
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm outline-none focus:border-brand transition-colors"
          />
        </div>

        {!confirmed ? (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Pilih tanggal</label>
              <BookingCalendar selectedDate={date} onSelectDate={setDate} />
            </div>

            <button
              type="button"
              disabled={!name.trim() || !location.trim() || !date}
              onClick={() => setConfirmed(true)}
              className="w-full py-4 rounded-2xl bg-white/10 text-cream text-base font-bold disabled:opacity-30 transition-colors"
            >
              Lanjut →
            </button>
          </>
        ) : (
          <>
            {/* Summary */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
              <p className="text-xs tracking-widest uppercase text-cream/40 mb-1">Ringkasan Pesanan</p>
              {[
                { label: 'Nama',    value: name },
                { label: 'Lokasi',  value: location },
                { label: 'Tanggal', value: date },
                { label: 'Paket',   value: state?.package || '-' },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-xs text-cream/40">{r.label}</span>
                  <span className="text-sm text-cream font-medium">{r.value}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setConfirmed(false)}
              className="text-cream/40 text-xs text-center"
            >
              ← Ubah data
            </button>

            <p className="text-xs text-cream/30 text-center">WhatsApp akan terbuka otomatis 💬</p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-brand text-dark text-base font-bold disabled:opacity-40 transition-colors"
            >
              {loading ? 'Mengirim...' : '💬 Kirim via WhatsApp'}
            </button>
          </>
        )}

      </form>
    </div>
  )
}
