export default function Contact() {
  return (
    <section id="contact" className="py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
          Contact
        </p>
        <h2 className="text-2xl font-bold text-zinc-50 mb-4">
          Ada project? Yuk ngobrol.
        </h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-10">
          Kami open buat booking & kolaborasi. Wedding, wisuda, event, atau promo brand — gas aja.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="https://wa.me/+6282213723022"  
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white text-zinc-950 px-6 py-3 text-sm font-medium hover:bg-zinc-200 transition-colors duration-200 w-full sm:w-auto"
          >
            WhatsApp
          </a>
          <a
            href="https://instagram.com/mizwar_films"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-700 text-zinc-200 px-6 py-3 text-sm font-medium hover:border-zinc-400 transition-colors duration-200 w-full sm:w-auto"
          >
            Instagram
          </a>
        </div>

        <a
          href="mailto:mizwar797@gmail.com"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-4"
        >
          Email: Mizwar Films
        </a>

      </div>
    </section>
  )
}