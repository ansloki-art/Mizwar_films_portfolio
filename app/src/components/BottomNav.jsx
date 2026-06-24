import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/',         label: 'Home',    icon: '⌂' },
  { to: '/packages', label: 'Paket',   icon: '◈' },
  { to: '/about',    label: 'Tentang', icon: '◎' },
  { to: '/settings', label: 'Setelan', icon: '⚙' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark border-t border-white/10 flex">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs transition-colors
            ${isActive ? 'text-cream' : 'text-cream/30 hover:text-cream/60'}`
          }
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          <span className="tracking-wide">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
