import { useState } from 'react'
import BookingCalendar from './BookingCalendar'
import BookingForm from './BookingForm'

export default function Schedule({ paket, setPaket }) {
  const [tanggal, setTanggal] = useState("")

  return (
    <section id="schedule" className="py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-6">

        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
          Jadwal
        </p>
        <h2 className="text-2xl font-bold text-zinc-50 mb-4">
          Cek Ketersediaan & Booking
        </h2>
        <p className="text-zinc-400 text-sm max-w-md mb-10">
          Klik tanggal kosong di kalender untuk booking sesi.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <BookingCalendar selectedDate={tanggal} onSelectDate={setTanggal} />
          <BookingForm tanggal={tanggal} setTanggal={setTanggal} paket={paket} setPaket={setPaket} />
        </div>

      </div>
    </section>
  )
}
