import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './screens/Home'
import Packages from './screens/Packages'
import Booking from './screens/Booking'
import About from './screens/About'
import Settings from './screens/Settings'
import BottomNav from './components/BottomNav'

function Layout() {
  const location = useLocation()
  const hideNav = location.pathname === '/booking'

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
