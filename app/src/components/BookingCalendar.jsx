import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { HARI, BULAN, toKey } from '../utils/dateUtils'

export default function BookingCalendar({ selectedDate, onSelectDate }) {
  const today = new Date()
  const todayKey = toKey(today)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [booked, setBooked] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBooked() {
      const { data } = await supabase.from('booked_dates').select('date')
      setBooked(data || [])
      setLoading(false)
    }
    loadBooked()
  }, [])

  const bookedSet = new Set(booked.map(b => b.date))

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4">

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg text-cream/40 hover:text-cream hover:bg-white/10 transition-all text-lg">‹</button>
        <p className="text-sm font-semibold text-cream">{BULAN[viewMonth]} {viewYear}</p>
        <button type="button" onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg text-cream/40 hover:text-cream hover:bg-white/10 transition-all text-lg">›</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center mb-1">
        {HARI.map(h => <div key={h} className="text-xs text-cream/30 py-1">{h}</div>)}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />
          const key = toKey(new Date(viewYear, viewMonth, d))
          const isBooked = bookedSet.has(key)
          const isSelected = key === selectedDate
          const isPast = key < todayKey

          if (isPast) return (
            <div key={i} className="aspect-square flex items-center justify-center rounded-lg text-xs text-cream/20 cursor-not-allowed">{d}</div>
          )

          if (isBooked) return (
            <div key={i} className="aspect-square flex items-center justify-center rounded-lg text-xs text-red-400/60 bg-red-500/10 border border-red-500/20 cursor-not-allowed">{d}</div>
          )

          return (
            <button type="button" key={i} onClick={() => onSelectDate?.(key)}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs transition-all ${
                isSelected ? 'bg-brand text-dark font-bold' : 'text-cream/70 hover:bg-white/10 hover:text-cream'
              }`}
            >{d}</button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-cream/30">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400/50" />Sudah ada job</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand" />Tersedia</span>
      </div>

      {loading && <p className="text-center text-cream/20 text-xs mt-2">Memuat jadwal...</p>}
    </div>
  )
}
