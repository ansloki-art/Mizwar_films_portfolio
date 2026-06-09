const gear = [
  "Lumix s5",
  "DJI RS4",
  "DaVinci Resolve",
  "Godox SL-60W"
]

export default function About() {
  return (
    <section id="about" className="py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-6">

        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
          About
        </p>
        <h2 className="text-2xl font-bold text-zinc-50 mb-10">
          The Person Behind the Lens
        </h2>

        <div className="grid sm:grid-cols-2 gap-12 items-start">

          <p className="text-zinc-400 leading-relaxed">
            Halo, Kami <span className="text-zinc-50 font-medium">Mizwar Films</span> — Setiap foto adalah cerita, setiap video adalah kenangan abadi. Mizwar Films hadir untuk menciptakan visual yang autentik dan berkelas.
          </p>

          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">
              Gear & Tools
            </p>
            <div className="flex flex-wrap gap-2">
              {gear.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-300 hover:border-zinc-500 hover:text-zinc-200 transition-colors duration-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}