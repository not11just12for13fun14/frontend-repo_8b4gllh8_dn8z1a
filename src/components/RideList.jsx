import { useEffect, useState } from 'react'

function RideCard({ ride, onRequest }) {
  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-semibold">{ride.origin} → {ride.destination}</h3>
        <span className="text-xs text-blue-300/80">{new Date(ride.departure_time).toLocaleString()}</span>
      </div>
      <p className="text-blue-200/90 text-sm">Driver: {ride.driver_name}{ride.car_model ? ` · ${ride.car_model}` : ''}</p>
      <p className="text-blue-200/70 text-sm">Seats: {ride.seats_available}</p>
      {ride.notes && <p className="text-blue-200/70 text-sm">{ride.notes}</p>}
      <div className="flex gap-2 mt-2">
        <button onClick={() => onRequest(ride)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-3 py-1 rounded">Request</button>
        <span className="text-blue-300/70 text-xs">Contact: {ride.contact}</span>
      </div>
    </div>
  )
}

export default function RideList() {
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState({ open: false, ride: null })
  const [reqForm, setReqForm] = useState({ requester_name: '', contact: '', message: '' })
  const [reqLoading, setReqLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/rides`)
      if (!res.ok) throw new Error('Failed to load rides')
      const data = await res.json()
      setRides(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openRequest = (ride) => {
    setModal({ open: true, ride })
  }

  const submitRequest = async (e) => {
    e.preventDefault()
    if (!modal.ride) return
    setReqLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/rides/${modal.ride.id}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqForm)
      })
      if (!res.ok) throw new Error('Failed to send request')
      setModal({ open: false, ride: null })
      setReqForm({ requester_name: '', contact: '', message: '' })
      alert('Request sent to driver!')
    } catch (e) {
      alert(e.message)
    } finally {
      setReqLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-semibold">Latest Rides</h2>
        <button onClick={load} className="text-sm text-blue-300 hover:text-white">Refresh</button>
      </div>

      {loading && <p className="text-blue-200/80">Loading rides...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        {rides.map(r => <RideCard key={r.id} ride={r} onRequest={openRequest} />)}
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white text-lg font-semibold mb-2">Request Ride</h3>
            <p className="text-blue-200/80 mb-4">{modal.ride.origin} → {modal.ride.destination} · {new Date(modal.ride.departure_time).toLocaleString()}</p>
            <form onSubmit={submitRequest} className="space-y-3">
              <input className="w-full bg-slate-800 text-white rounded px-3 py-2 border border-slate-700" placeholder="Your name" value={reqForm.requester_name} onChange={e=>setReqForm({...reqForm, requester_name: e.target.value})} required />
              <input className="w-full bg-slate-800 text-white rounded px-3 py-2 border border-slate-700" placeholder="Contact" value={reqForm.contact} onChange={e=>setReqForm({...reqForm, contact: e.target.value})} required />
              <textarea className="w-full bg-slate-800 text-white rounded px-3 py-2 border border-slate-700" placeholder="Message (optional)" rows={3} value={reqForm.message} onChange={e=>setReqForm({...reqForm, message: e.target.value})} />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={()=>setModal({ open:false, ride:null })} className="px-3 py-2 rounded bg-slate-700 text-white">Cancel</button>
                <button disabled={reqLoading} className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white">{reqLoading ? 'Sending...' : 'Send Request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
