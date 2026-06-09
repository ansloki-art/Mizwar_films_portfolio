import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { HARI, BULAN, toKey } from "../utils/dateUtils";

export default function BookingCalendar({ selectedDate, onSelectDate }) {
  const today = new Date();
  const todayKey = toKey(today);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [booked, setBooked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBooked(); }, []);

  async function loadBooked() {
    setLoading(true);
    const { data, error } = await supabase.from("booked_dates").select("date, note");
    if (!error && data) setBooked(data);
    setLoading(false);
  }

  const bookedMap = {};
  booked.forEach((b) => (bookedMap[b.date] = b.note));

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 text-zinc-50 rounded-2xl p-6">

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-50 hover:bg-zinc-800 transition-all duration-150 text-lg"
        >
          ‹
        </button>
        <h3 className="text-sm font-semibold tracking-wide text-zinc-50">
          {BULAN[viewMonth]} {viewYear}
        </h3>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-50 hover:bg-zinc-800 transition-all duration-150 text-lg"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center mb-1">
        {HARI.map((h) => (
          <div key={h} className="text-xs text-zinc-600 py-1">{h}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const key = toKey(new Date(viewYear, viewMonth, d));
          const isBooked = key in bookedMap;
          const isSelected = key === selectedDate;
          const isToday = key === todayKey;
          const isPast = key < todayKey;

          if (isPast) {
            return (
              <div
                key={i}
                className="aspect-square flex items-center justify-center rounded-lg text-xs text-zinc-700 cursor-not-allowed"
              >
                {d}
              </div>
            );
          }

          if (isBooked) {
            return (
              <div
                key={i}
                title="Sudah ada job"
                className="aspect-square flex items-center justify-center rounded-lg text-xs text-red-400/70 bg-red-500/10 border border-red-500/20 cursor-not-allowed font-medium"
              >
                {d}
              </div>
            );
          }

          return (
            <button
              key={i}
              onClick={() => onSelectDate?.(key)}
              className={
                "aspect-square flex items-center justify-center rounded-lg text-xs transition-all duration-150 " +
                (isSelected
                  ? "bg-zinc-50 text-zinc-950 font-semibold shadow-sm"
                  : isToday
                  ? "text-zinc-50 ring-1 ring-inset ring-zinc-600 hover:bg-zinc-800"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50")
              }
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-5 mt-6 pt-4 border-t border-zinc-800/60 text-xs text-zinc-600">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400/50 inline-block" />
          Sudah ada job
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-50 inline-block" />
          Tersedia
        </span>
      </div>

      {loading && (
        <p className="text-center text-zinc-700 text-xs mt-3">Memuat jadwal...</p>
      )}
    </div>
  );
}
