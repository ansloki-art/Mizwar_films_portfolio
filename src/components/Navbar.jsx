import { useState } from "react"

const links = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Jadwal", href: "#schedule" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">

      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        <a href="#top" className="shrink-0">
          <img src="/logomizwar.PNG" alt="Mizwar Films" className="h-11 w-11 rounded-full object-cover" />
        </a>

        {/* Desktop links */}
        <ul className="hidden sm:flex gap-6 text-sm text-zinc-400">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-zinc-50 transition-colors duration-200">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden flex flex-col gap-1.5 p-2 text-zinc-400 hover:text-zinc-50 transition-colors"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-zinc-800 bg-zinc-950">
          <ul className="flex flex-col py-3">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-3 text-sm text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900 transition-colors duration-150"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

    </nav>
  )
}
