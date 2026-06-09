import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Showreel from './components/Showreel'
import Work from './components/Work'
import Services from './components/Services'
import Schedule from './components/Schedule'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminPanel from './AdminPanel'
import LoadingScreen from './components/LoadingScreen'

function Portfolio() {
  const [paket, setPaket] = useState("")

  function handlePesan(category) {
    setPaket(category)
    document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="bg-zinc-950 text-zinc-400">
      <LoadingScreen />
      <Navbar />
      <Hero />
      <Services onPesan={handlePesan} />
      <Work />
      <Schedule paket={paket} setPaket={setPaket} />
      <Showreel />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}
