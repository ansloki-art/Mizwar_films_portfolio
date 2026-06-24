import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { packages as defaultPackages } from '../data/packages'

const SiteContext = createContext(null)

const DEFAULT_CONTACT = {
  whatsapp: '6282213723022',
  instagram: '@mizwar_films',
  email: 'mizwar797@gmail.com',
}

function toFlatPackages(services) {
  if (!services?.length) return defaultPackages
  const KEY_MAP = {
    'Nikah + Prewedding': 'NIKAH_PREWEDDING',
    'Wedding':            'WEDDING',
    'Engagement':         'ENGAGEMENT',
    'Aqiqah':             'AQIQAH',
    'Wisuda':             'WISUDA',
  }
  const flat = []
  services.forEach(svc => {
    const key = KEY_MAP[svc.category] || svc.category.toUpperCase().replace(/\s+/g, '_')
    svc.packages.forEach(pkg => {
      flat.push({ category: key, label: pkg.name, price: pkg.price, items: pkg.includes || [] })
    })
  })
  return flat.length ? flat : defaultPackages
}

export function SiteProvider({ children }) {
  const [db, setDb]       = useState(null)
  const [ready, setReady] = useState(false)

  const load = useCallback(async () => {
    const { data } = await supabase.from('site_settings').select('settings').eq('id', 1).single()
    setDb(data?.settings ?? {})
    setReady(true)
  }, [])

  useEffect(() => { load() }, [load])

  const value = useMemo(() => ({
    packages: toFlatPackages(db?.services),
    contact:  { ...DEFAULT_CONTACT, ...(db?.contact || {}) },
    ready,
  }), [db, ready])

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export const useSite = () => useContext(SiteContext)
