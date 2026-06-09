export default function Showreel() {
  return (
    <section id="showreel" className="py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-6">

        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
          Showreel
        </p>
        <h2 className="text-2xl font-bold text-zinc-50 mb-10">
          Featured Work
        </h2>

        <div className="aspect-video w-full rounded-xl overflow-hidden border border-zinc-800">
          <iframe
            src="https://www.youtube.com/embed/5Rn25pfWWrc"
            title="Showreel"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full"
          />
        </div>

        <p className="text-zinc-500 text-sm mt-4">
          Showreel 2026 — Wedding, Wisuda & Event Coverage
        </p>

      </div>
    </section>
  )
}