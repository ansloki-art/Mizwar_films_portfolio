import { useState } from 'react'
import { useSite } from '../context/SiteContext'

function ToggleRow({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/10">
      <div>
        <p className="text-sm font-medium text-cream">{label}</p>
        {description && <p className="text-xs text-cream/40 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative border border-white/20 ${value ? 'bg-brand' : 'bg-cream/20'}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full transition-all ${value ? 'left-6 bg-white' : 'left-1 bg-dark'}`} />
      </button>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <p className="text-xs tracking-widest uppercase text-cream/40 mb-2 px-4">{title}</p>
      <div className="bg-white/5 border border-white/10 rounded-2xl px-4">
        {children}
      </div>
    </div>
  )
}

export default function Settings() {
  const [notif, setNotif] = useState(false)
  const { contact } = useSite()

  async function handleNotifToggle(val) {
    if (val) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotif(true)
        new Notification('Mizwar Films', {
          body: 'Notifikasi aktif! Kamu akan dapat info terbaru dari kami.',
          icon: '/logo.png',
        })
      } else {
        setNotif(false)
      }
    } else {
      setNotif(false)
    }
  }

  return (
    <div className="min-h-svh bg-dark text-cream pb-24">

      <div className="px-6 pt-12 pb-8">
        <h2 className="text-2xl font-bold tracking-widest uppercase">Setelan</h2>
        <p className="text-cream/40 text-xs mt-1">Atur preferensi aplikasi</p>
      </div>

      <div className="px-4">

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 mb-6">
          <img src="/logo.png" alt="Mizwar Films" className="w-12 h-12 shrink-0 object-contain" />
          <div>
            <p className="font-bold text-cream">Mizwar Films</p>
            <p className="text-xs text-cream/40">Videography & Photography</p>
            <p className="text-xs text-brand mt-1">v1.0.0</p>
          </div>
        </div>

        <Section title="Preferensi">
          <ToggleRow label="Notifikasi" description="Promo dan info terbaru" value={notif} onChange={handleNotifToggle} />
        </Section>

        <Section title="Hubungi Kami">
          <a href={`https://www.instagram.com/${contact.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between py-4 border-b border-white/10">
            <p className="text-sm text-cream">Instagram</p>
            <span className="text-cream/30 text-xs">@mizwar_films →</span>
          </a>
          <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between py-4 border-b border-white/10">
            <p className="text-sm text-cream">WhatsApp</p>
            <span className="text-cream/30 text-xs">Chat kami →</span>
          </a>
          <div className="flex items-center justify-between py-4">
            <p className="text-sm text-cream">Versi App</p>
            <span className="text-cream/30 text-xs">1.0.0</span>
          </div>
        </Section>

      </div>
    </div>
  )
}
