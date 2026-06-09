import { services } from '../data/services'

export default function Services({ onPesan }) {
  return (
    <section id="services" className="py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-6">

        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
          Services
        </p>
        <h2 className="text-2xl font-bold text-zinc-50 mb-12">
          Paket & Harga
        </h2>

        <div className="flex flex-col gap-16">
          {services.map((service) => (
            <div key={service.category}>

              <h3 className="text-lg font-semibold text-zinc-300 uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">
                {service.category}
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.packages.map((pkg) => (
                  <div key={pkg.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col h-full hover:border-zinc-700 transition-colors duration-200">

                    <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                      {pkg.name}
                    </p>
                    <p className="text-2xl font-bold text-zinc-50 mb-6">
                      {pkg.price}
                    </p>

                    <ul className="flex flex-col gap-2 flex-1 mb-6">
                      {pkg.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
                          <span className="text-zinc-500 mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => onPesan(service.category)}
                      className="w-full text-center rounded-lg bg-white text-zinc-950 px-4 py-2.5 text-sm font-medium hover:bg-zinc-200 transition-colors duration-200"
                    >
                      Pesan Sekarang
                    </button>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        <p className="text-zinc-500 text-sm mt-12">
          Custom request? <a href="#contact" className="text-zinc-300 hover:text-zinc-50 transition-colors underline underline-offset-4">Chat aja.</a>
        </p>

      </div>
    </section>
  )
}