import RideForm from './components/RideForm'
import RideList from './components/RideList'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.07),transparent_60%)]"></div>

      <header className="relative z-10 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Logo" className="w-10 h-10" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">RideWave</h1>
          </div>
          <a href="/test" className="text-blue-300 hover:text-white text-sm">System Check</a>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-16">
        <section className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RideForm onCreated={() => { /* RideList has refresh button; optional integration */ }} />
          </div>
          <div className="lg:col-span-2">
            <RideList />
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-6 py-8 border-t border-blue-500/10">
        <div className="max-w-6xl mx-auto text-center text-blue-300/70 text-sm">
          Share your ride, meet new people, and save on travel.
        </div>
      </footer>
    </div>
  )
}

export default App
