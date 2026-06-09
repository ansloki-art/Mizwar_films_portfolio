import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { HARI, BULAN, toKey } from "./utils/dateUtils";

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleLogin() {
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError("Email atau password salah.");
  }
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <div className="bg-neutral-900 p-6 rounded-xl w-80">
          <h2 className="text-lg font-semibold mb-4 text-center">Admin Jadwal</h2>
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded bg-neutral-800 outline-none"
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded bg-neutral-800 outline-none"
          />
          {authError && <p className="text-red-400 text-xs mb-3">{authError}</p>}
          <button onClick={handleLogin}
            className="w-full py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400">
            Masuk
          </button>
        </div>
      </div>
    );
  }

  return <AdminCalendar onLogout={handleLogout} />;
}

function AdminCalendar({ onLogout }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [booked, setBooked] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(null);
  const [draftNote, setDraftNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadBooked(); }, []);

  async function loadBooked() {
    setLoading(true);
    const { data, error } = await supabase.from("booked_dates").select("date, note");
    if (!error && data) setBooked(data);
    setLoading(false);
  }

  const bookedMap = {};
  booked.forEach((b) => (bookedMap[b.date] = b.note));

  function openDate(key) {
    setSelectedDate(key);
    if (key in bookedMap) {
      setDraftNote(bookedMap[key] || "");
      setIsEditing(false);
    } else {
      setDraftNote("");
      setIsEditing(true);
    }
  }

  function closePanel() {
    setSelectedDate(null);
    setDraftNote("");
    setIsEditing(false);
  }

  async function saveNote() {
    setSaving(true);
    if (selectedDate in bookedMap) {
      await supabase.from("booked_dates").update({ note: draftNote }).eq("date", selectedDate);
    } else {
      await supabase.from("booked_dates").insert({ date: selectedDate, note: draftNote });
    }
    await loadBooked();
    setSaving(false);
    setIsEditing(false);
  }

  async function deleteNote() {
    if (!confirm("Hapus job & catatan tanggal ini?")) return;
    setSaving(true);
    await supabase.from("booked_dates").delete().eq("date", selectedDate);
    await loadBooked();
    setSaving(false);
    closePanel();
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
    closePanel();
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
    closePanel();
  }

  function prettyDate(key) {
    if (!key) return "";
    const [y, m, d] = key.split("-");
    return `${parseInt(d)} ${BULAN[parseInt(m) - 1]} ${y}`;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Atur Jadwal</h2>
          <button onClick={onLogout} className="text-xs text-neutral-400 hover:text-white">Keluar</button>
        </div>

        <p className="text-xs text-neutral-400 mb-4">
          Klik tanggal untuk lihat / tambah catatan.
        </p>

        <div className="bg-neutral-900 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="px-3 py-1 hover:text-amber-400">&lsaquo;</button>
            <h3 className="font-semibold">{BULAN[viewMonth]} {viewYear}</h3>
            <button onClick={nextMonth} className="px-3 py-1 hover:text-amber-400">&rsaquo;</button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs text-neutral-400 mb-2">
            {HARI.map((h) => <div key={h}>{h}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const key = toKey(new Date(viewYear, viewMonth, d));
              const isBooked = key in bookedMap;
              const isSelected = key === selectedDate;
              return (
                <div key={i} className="relative group">
                  <button
                    onClick={() => openDate(key)}
                    className={
                      "w-full py-2 rounded transition " +
                      (isSelected ? "ring-2 ring-amber-400 " : "") +
                      (isBooked
                        ? "bg-red-500/80 text-white font-semibold hover:bg-red-600"
                        : "text-neutral-200 hover:bg-neutral-700")
                    }
                  >
                    {d}
                  </button>
                  {isBooked && bookedMap[key] && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 hidden group-hover:block pointer-events-none">
                      <div className="bg-neutral-700 text-neutral-100 text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                        {bookedMap[key]}
                      </div>
                      <div className="w-2 h-2 bg-neutral-700 rotate-45 mx-auto -mt-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="bg-neutral-900 rounded-xl p-5 mt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-amber-400">{prettyDate(selectedDate)}</h4>
              <button onClick={closePanel} className="text-neutral-400 hover:text-white text-sm">&times;</button>
            </div>

            {!isEditing && selectedDate in bookedMap && (
              <>
                <div className="bg-neutral-800 rounded p-3 text-sm whitespace-pre-wrap min-h-15 mb-3">
                  {bookedMap[selectedDate] || <span className="text-neutral-500">Tanpa catatan</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(true)}
                    className="flex-1 py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400">
                    Edit
                  </button>
                  <button onClick={deleteNote} disabled={saving}
                    className="flex-1 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700">
                    Hapus
                  </button>
                </div>
              </>
            )}

            {isEditing && (
              <>
                <textarea
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  rows={5}
                  placeholder="Tulis catatan... (jam, klien, lokasi, dll)"
                  className="w-full bg-neutral-800 rounded p-3 text-sm outline-none mb-3 resize-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={saveNote} disabled={saving}
                    className="flex-1 py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400">
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    onClick={() => {
                      if (selectedDate in bookedMap) setIsEditing(false);
                      else closePanel();
                    }}
                    className="flex-1 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600">
                    Batal
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {loading && <p className="text-center text-neutral-500 text-xs mt-3">Memuat...</p>}
      </div>
    </div>
  );
}