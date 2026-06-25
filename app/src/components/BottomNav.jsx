import { NavLink } from 'react-router-dom'

const tabs = [
  {
    to: '/', label: 'Home',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/></svg>,
  },
  {
    to: '/packages', label: 'Paket',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    to: '/about', label: 'Tentang',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  },
  {
    to: '/settings', label: 'Setelan',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>,
  },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark border-t border-white/20 flex">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs transition-colors relative
            ${isActive ? 'text-brand' : 'text-cream/70 hover:text-cream'}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <span className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-brand rounded-full" />}
              {tab.icon}
              <span className="tracking-wide">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
