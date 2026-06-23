import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { HARI, BULAN, toKey } from "./utils/dateUtils";
import { useSite } from "./context/SiteContext";

const UPLOAD_CATEGORIES = ["Pre-wedding", "Wedding", "Wisuda", "Engagement", "Aqiqah", "Event"];
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("mf_admin") === "1");
  const [input, setInput]   = useState("");
  const [error, setError]   = useState("");

  function handleLogin() {
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem("mf_admin", "1");
      setAuthed(true);
    } else {
      setError("Password salah.");
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <div className="bg-neutral-900 p-6 rounded-xl w-80">
          <h2 className="text-lg font-semibold mb-4 text-center">Admin Mizwar Films</h2>
          <input
            type="password" placeholder="Password" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full mb-3 px-3 py-2 rounded bg-neutral-800 outline-none"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          <button onClick={handleLogin}
            className="w-full py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400">
            Masuk
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => { sessionStorage.removeItem("mf_admin"); setAuthed(false); }} />;
}

function AdminDashboard({ onLogout }) {
  const [tab, setTab]     = useState("jadwal");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    async function checkUpcoming() {
      const today = new Date();
      const in7   = new Date(); in7.setDate(today.getDate() + 7);
      const todayStr = toKey(today);
      const in7Str   = toKey(in7);

      const { data } = await supabase.from("booked_dates").select("date, note")
        .gte("date", todayStr).lte("date", in7Str).order("date");

      if (data?.length) {
        setToasts(data.map(b => ({
          id: b.date,
          msg: `📅 ${prettyDate(b.date)}${b.note ? ` — ${b.note}` : ""}`,
        })));
      }
    }
    checkUpcoming();
  }, []);

  function prettyDate(key) {
    const [y, m, d] = key.split("-");
    return `${parseInt(d)} ${BULAN[parseInt(m) - 1]} ${y}`;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <button onClick={onLogout} className="text-xs text-neutral-400 hover:text-white">Keluar</button>
        </div>

        {toasts.length > 0 && (
          <div className="flex flex-col gap-2 mb-5">
            {toasts.map(t => (
              <div key={t.id} className="flex items-start justify-between gap-3 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
                <p className="text-sm text-amber-300">{t.msg}</p>
                <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                  className="text-amber-500 hover:text-amber-300 text-lg leading-none shrink-0">&times;</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "jadwal",    label: "Jadwal" },
            { key: "foto",      label: "Upload Foto" },
            { key: "pengingat", label: "Pengingat" },
            { key: "setelan",   label: "Setelan" },
          ].map(({ key, label }) => (
            <button key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                tab === key ? "bg-amber-500 text-black" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "jadwal"    && <AdminCalendar />}
        {tab === "foto"      && <AdminGallery />}
        {tab === "pengingat" && <AdminPengingat />}
        {tab === "setelan"   && <AdminSetelan />}
      </div>
    </div>
  );
}

function AdminCalendar() {
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
    <>
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
    </>
  );
}

function AdminGallery() {
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [title, setTitle]         = useState("");
  const [category, setCategory]   = useState("Wedding");
  const [filterCat, setFilterCat] = useState("Semua");
  const [uploading, setUploading] = useState(false);
  const [reelsList, setReelsList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => { loadReels(); }, []);

  async function loadReels() {
    setLoadingList(true);
    const { data } = await supabase.from("reels").select("*").order("created_at", { ascending: false });
    if (data) setReelsList(data);
    setLoadingList(false);
  }

  function onFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError("");

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: upErr } = await supabase.storage.from("reels").upload(path, file);
    if (upErr) {
      setError("Upload gagal: " + upErr.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("reels").getPublicUrl(path);

    const { error: dbErr } = await supabase.from("reels").insert({ title, category, url: publicUrl });
    if (dbErr) {
      setError("Simpan data gagal: " + dbErr.message);
      setUploading(false);
      return;
    }

    setFile(null);
    setPreview(null);
    setTitle("");
    await loadReels();
    setUploading(false);
  }

  async function handleDelete(id, url) {
    if (!confirm("Hapus foto ini?")) return;
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    await supabase.storage.from("reels").remove([fileName]);
    await supabase.from("reels").delete().eq("id", id);
    await loadReels();
  }

  return (
    <>
      <div className="bg-neutral-900 rounded-xl p-5 mb-4">
        <h3 className="text-sm font-semibold mb-4">Upload Foto Baru</h3>

        <label className="block mb-3">
          <span className="text-xs text-neutral-400 mb-1 block">Pilih Foto</span>
          <input
            type="file" accept="image/*"
            onChange={onFileChange}
            className="w-full text-sm text-neutral-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-neutral-700 file:text-neutral-200 hover:file:bg-neutral-600 cursor-pointer"
          />
        </label>

        {preview && (
          <img src={preview} alt="preview" className="w-full max-h-48 object-contain rounded mb-3 bg-neutral-800" />
        )}

        <label className="block mb-3">
          <span className="text-xs text-neutral-400 mb-1 block">Judul (opsional)</span>
          <input
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Nama klien / event..."
            className="w-full bg-neutral-800 rounded px-3 py-2 text-sm outline-none"
          />
        </label>

        <label className="block mb-4">
          <span className="text-xs text-neutral-400 mb-1 block">Kategori</span>
          <select
            value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-neutral-800 rounded px-3 py-2 text-sm outline-none"
          >
            {UPLOAD_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <button
          onClick={handleUpload} disabled={!file || uploading}
          className="w-full py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? "Mengupload..." : "Upload"}
        </button>
      </div>

      <div className="bg-neutral-900 rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">Foto Tersimpan ({reelsList.length})</h3>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {["Semua", ...UPLOAD_CATEGORIES].map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                filterCat === c ? "bg-amber-500 text-black" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}>
              {c}
            </button>
          ))}
        </div>

        {loadingList && <p className="text-neutral-500 text-xs">Memuat...</p>}
        {!loadingList && reelsList.length === 0 && (
          <p className="text-neutral-500 text-xs">Belum ada foto yang diupload.</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {reelsList.filter(r => filterCat === "Semua" || r.category === filterCat).map((reel) => (
            <div key={reel.id} className="relative group rounded-lg overflow-hidden bg-neutral-800">
              <img src={reel.url} alt={reel.title} className="w-full aspect-9/16 object-cover" />
              <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/70 transition-colors duration-200" />
              <div className="absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-xs text-amber-400 mb-0.5">{reel.category}</p>
                {reel.title && <p className="text-xs text-white mb-1 truncate">{reel.title}</p>}
                <button
                  onClick={() => handleDelete(reel.id, reel.url)}
                  className="text-xs text-red-400 hover:text-red-300 text-left"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Pengingat ──────────────────────────────────────────────────
function AdminPengingat() {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      const todayStr = toKey(new Date());
      const { data } = await supabase.from("booked_dates").select("date, note")
        .gte("date", todayStr).order("date");
      setUpcoming(data || []);
      setLoading(false);
    }
    load();
  }, []);

  function prettyDate(key) {
    const [y, m, d] = key.split("-");
    return `${parseInt(d)} ${BULAN[parseInt(m) - 1]} ${y}`;
  }

  function daysFrom(dateStr) {
    const diff = Math.round((new Date(dateStr) - new Date(toKey(new Date()))) / 86400000);
    if (diff === 0) return "Hari ini";
    if (diff === 1) return "Besok";
    return `${diff} hari lagi`;
  }

  return (
    <div className="bg-neutral-900 rounded-xl p-5">
      <h3 className="text-sm font-semibold mb-1">Booking Mendatang</h3>
      <p className="text-xs text-neutral-500 mb-4">Otomatis dari jadwal yang sudah diisi.</p>
      {loading && <p className="text-xs text-neutral-500">Memuat...</p>}
      {!loading && upcoming.length === 0 && (
        <p className="text-xs text-neutral-500">Tidak ada booking mendatang.</p>
      )}
      <div className="flex flex-col gap-3">
        {upcoming.map(b => (
          <div key={b.date} className="bg-neutral-800 rounded-lg p-4 flex justify-between items-start gap-3">
            <div>
              <p className="text-amber-400 text-xs font-semibold mb-1">{prettyDate(b.date)}</p>
              <p className="text-sm text-neutral-200 whitespace-pre-wrap">{b.note || <span className="text-neutral-500">Tanpa catatan</span>}</p>
            </div>
            <span className="text-xs text-neutral-400 shrink-0 bg-neutral-700 px-2 py-1 rounded">
              {daysFrom(b.date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Setelan ────────────────────────────────────────────────────
function AdminSetelan() {
  const site = useSite();
  const [subTab, setSubTab]   = useState("kontak");
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [contact, setContact] = useState({ ...site.contact });
  const [services, setServices] = useState(JSON.parse(JSON.stringify(site.services)));

  async function saveSection(key, data) {
    setSaving(true);
    const { data: row } = await supabase.from("site_settings").select("settings").eq("id", 1).single();
    const current = row?.settings || {};
    await supabase.from("site_settings").update({ settings: { ...current, [key]: data } }).eq("id", 1);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    site.refresh();
  }

  function updatePkg(catIdx, pkgIdx, field, value) {
    setServices(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next[catIdx].packages[pkgIdx][field] = value;
      return next;
    });
  }

  const SaveBtn = () => (
    <button onClick={() => subTab === "kontak" ? saveSection("contact", contact) : saveSection("services", services)}
      disabled={saving}
      className="mt-2 w-full py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors text-sm">
      {saving ? "Menyimpan..." : saved ? "Tersimpan ✓" : "Simpan"}
    </button>
  );

  return (
    <>
      <div className="flex gap-2 mb-5">
        {[{ key: "kontak", label: "Kontak" }, { key: "paket", label: "Paket" }].map(({ key, label }) => (
          <button key={key} onClick={() => setSubTab(key)}
            className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
              subTab === key ? "bg-amber-500 text-black" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {subTab === "kontak" && (
        <div className="bg-neutral-900 rounded-xl p-5 flex flex-col gap-4">
          {[
            { label: "WhatsApp (angka saja)", key: "whatsapp", placeholder: "6282213723022" },
            { label: "Instagram",             key: "instagram", placeholder: "@mizwar_films" },
            { label: "Email",                 key: "email",     placeholder: "mizwar797@gmail.com" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <span className="text-xs text-neutral-400 block mb-1">{label}</span>
              <input value={contact[key] || ""} onChange={e => setContact(c => ({ ...c, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-neutral-800 rounded px-3 py-2 text-sm outline-none text-white" />
            </div>
          ))}
          <SaveBtn />
        </div>
      )}

      {subTab === "paket" && (
        <div className="flex flex-col gap-6">
          {services.map((svc, catIdx) => (
            <div key={catIdx} className="bg-neutral-900 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-widest">{svc.category}</h3>
              <div className="flex flex-col gap-5">
                {svc.packages.map((pkg, pkgIdx) => (
                  <div key={pkgIdx} className="border border-neutral-800 rounded-lg p-4 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-neutral-400 block mb-1">Nama Paket</span>
                        <input value={pkg.name}
                          onChange={e => updatePkg(catIdx, pkgIdx, "name", e.target.value)}
                          className="w-full bg-neutral-800 rounded px-3 py-2 text-sm outline-none text-white" />
                      </div>
                      <div>
                        <span className="text-xs text-neutral-400 block mb-1">Harga</span>
                        <input value={pkg.price}
                          onChange={e => updatePkg(catIdx, pkgIdx, "price", e.target.value)}
                          className="w-full bg-neutral-800 rounded px-3 py-2 text-sm outline-none text-white" />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block mb-1">Isi Paket (satu per baris)</span>
                      <textarea
                        value={pkg.includes.join("\n")}
                        onChange={e => updatePkg(catIdx, pkgIdx, "includes", e.target.value.split("\n"))}
                        rows={4}
                        className="w-full bg-neutral-800 rounded px-3 py-2 text-sm outline-none resize-none text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <SaveBtn />
        </div>
      )}
    </>
  );
}
