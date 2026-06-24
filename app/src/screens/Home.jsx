import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const FALLBACK = [
  "wedding-01.jpg", "weddingcolase.jpg",
  "Engagement.jpg", "engagementcolase.jpg",
  "preweddcolase.jpg", "promo-01.jpg",
  "wisuda-01.jpg", "wisudacolase.jpg",
]

export default function Home() {
  const navigate = useNavigate()
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('reels').select('url').order('created_at', { ascending: false })
      if (data?.length) {
        setPhotos(data.map(r => ({ src: r.url, key: r.url })))
      } else {
        setPhotos(FALLBACK.map(name => ({ src: `/reels/${name}`, key: name })))
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-svh bg-dark text-cream pb-24">

      {/* Hero */}
      <div className="flex flex-col items-center justify-center px-6 pt-16 pb-10 text-center">
        <img src="/logo.png" alt="Mizwar Films" className="w-20 h-20 object-contain mb-4 rounded-full bg-black" />
        <h1 className="text-3xl font-bold tracking-widest uppercase mb-1">Mizwar Films</h1>
        <p className="text-cream/50 text-xs tracking-widest uppercase mb-6">Cinematography & Photography</p>
        <button
          onClick={() => navigate('/packages')}
          className="bg-brand text-cream px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-dark transition-colors"
        >
          Pesan Sekarang
        </button>
      </div>

      {/* Gallery Masonry */}
      <div className="px-3 columns-2 md:columns-4 gap-3 space-y-3">
        {photos.map(p => (
          <img
            key={p.key}
            src={p.src}
            alt=""
            loading="lazy"
            className="w-full rounded-xl break-inside-avoid"
          />
        ))}
      </div>

    </div>
  )
}
