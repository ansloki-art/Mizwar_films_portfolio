import { useSite } from '../context/SiteContext'

export default function About() {
  const { contact } = useSite()

  const contacts = [
    { label: 'Lokasi',    value: 'Lhokseumawe, Aceh' },
    { label: 'Instagram', value: contact.instagram, href: `https://www.instagram.com/${contact.instagram.replace('@', '')}` },
    { label: 'WhatsApp',  value: `0${contact.whatsapp.slice(2)}`, href: `https://wa.me/${contact.whatsapp}` },
    { label: 'Email',     value: contact.email, href: `mailto:${contact.email}` },
  ]

  return (
    <div className="min-h-svh bg-dark text-cream pb-24">

      {/* Profile */}
      <div className="flex justify-center pt-16 pb-8">
        <img src="/profile2.PNG" alt="Mizwar Films" className="w-40 h-52 object-cover object-center rounded-2xl" />
      </div>

      {/* About */}
      <div className="px-6 text-center mb-10">
        <p className="text-xs tracking-widest uppercase text-brand mb-2">Tentang Saya</p>
        <h2 className="text-2xl font-bold mb-4">Sosok Di Balik Lensa</h2>
        <div className="w-12 h-px bg-brand mx-auto mb-6 opacity-60" />
        <p className="text-cream/60 text-sm leading-relaxed">Tim videografer & fotografer profesional berbasis di Lhokseumawe, Aceh. Mengabadikan setiap momen dengan sentuhan sinematik.</p>
      </div>

      {/* Contact */}
      <div className="px-6">
        <p className="text-xs tracking-widest uppercase text-brand mb-6 text-center">Hubungi Kami</p>
        <div className="flex flex-col gap-4">
          {contacts.map(c => (
            <div key={c.label} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 flex justify-between items-center">
              <span className="text-xs tracking-widest uppercase text-cream/40">{c.label}</span>
              {c.href
                ? <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-sm text-cream hover:text-brand transition-colors">{c.value}</a>
                : <span className="text-sm text-cream">{c.value}</span>
              }
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
