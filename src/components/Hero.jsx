export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <img src="/hero-bg.jpg" alt="hero" className="absolute inset-0 w-full h-full object-cover object-[center_60%]" />

      <div className="absolute inset-0 bg-zinc-950/60" />

      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">

        <p className="text-xs uppercase tracking-[0.4em] text-black mb-4">
          Cinematographer & Photographer
        </p>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-zinc-50 leading-tight mb-6">
          MIZWAR FILMS
          <br />
          <span className="block text-xl sm:text-3xl lg:text-4xl text-zinc-400" style={{ fontFamily: "'Dancing Script', cursive" }}>Visual berkelas untuk moment paling berharga.</span>
        </h1>

        <p className="text-zinc-300 text-base sm:text-lg max-w-xl mx-auto mb-10">
          Photographer & Videographer asal Aceh yang fokus bikin konten sinematik — wedding, wisuda, event, dan promo brand.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <a href="#showreel" className="rounded-lg bg-white text-zinc-950 px-6 py-3 text-sm font-medium hover:bg-zinc-200 transition-colors">
            Watch Showreel
          </a>
          <a href="#schedule" className="rounded-lg border border-zinc-700 text-zinc-200 px-6 py-3 text-sm font-medium hover:border-zinc-400 transition-colors">
            Book Me
          </a>
        </div>

      </div>
    </section>
  )
}