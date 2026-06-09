import { useState } from 'react'
import { reels } from '../data/reels'

export default function Work() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="work" className="py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-6">

        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
          Work
        </p>
        <h2 className="text-2xl font-bold text-zinc-50 mb-10">
          Latest Reels
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {reels.map((reel) => (
            <button
              key={reel.title}
              onClick={() => setSelected(reel)}
              className="group relative block aspect-9/16 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors duration-300 text-left w-full"
            >
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/60 transition-colors duration-300" />

              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">
                  {reel.category}
                </p>
                <p className="text-sm font-medium text-zinc-50">
                  {reel.title}
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative flex flex-col max-h-[90vh] w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-9 right-0 text-zinc-400 hover:text-zinc-50 transition-colors duration-200 text-sm"
            >
              ✕ Close
            </button>

            <img
              src={selected.thumbnail}
              alt={selected.title}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />

            <div className="flex items-center justify-between mt-3 px-1">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">{selected.category}</p>
                <p className="text-sm font-medium text-zinc-50">{selected.title}</p>
              </div>
              {selected.link && (
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-400 hover:text-zinc-50 transition-colors duration-200 underline underline-offset-4 shrink-0 ml-4"
                >
                  View Original
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
