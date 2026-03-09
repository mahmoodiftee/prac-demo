// import { Suspense, lazy } from 'react'
import { useState } from 'react'
import MainLayout from './layout/MainLayout'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import Stack from './sections/Stack'
import Experience from './sections/Experience'
import About from './sections/About'
import Contact from './sections/Contact'
// ── Page reveal variants — swap the active import to switch ──────────────────
// import PageReveal from './components/PageReveal'               // v1: strip split
// import PageReveal from './components/PageRevealGrid'           // v2: grid assemble
// import PageReveal from './components/PageRevealStamp'          // v3: stamp & wipe
// import PageReveal from './components/PageRevealTypewriter'     // v4: typewriter manifesto
import PageReveal from './components/PageRevealNewspaper'      // v5: newspaper print
// import PageReveal from './components/PageRevealGlitch'            // v6: glitch identity

function App() {
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      {!revealed && <PageReveal onDone={() => setRevealed(true)} />}
      <MainLayout>
        <Hero />
        <Projects />
        <Stack />
        <Experience />
        <About />
        <Contact />
      </MainLayout>
    </>
  )
}

export default App
