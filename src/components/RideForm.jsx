import { useState } from 'react'

export default function RideForm({ onCreated }) {
  const [form, setForm] = useState({
    driver_name: '',
    car_model: '',
    seats_available: 1,
    origin: '',
    destination: '',
    departure_time: '',
    contact: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'seats_available' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const payload = {
        ...form,
        departure_time: form.departure_time ? new Date(form.departure_time).toISOString() : ''
      }
      const res = await fetch(`${baseUrl}/api/rides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create ride')
      setSuccess('Ride posted!')
      setForm({
        driver_name: '', car_model: '', seats_available: 1, origin: '', destination: '', departure_time: '', contact: '', notes: ''
      })
      onCreated && onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 sm:p-6">
      <h2 className="text-white text-xl font-semibold mb-4">Share a Ride</h2>
      {error && <p className="text-red-400 mb-3 text-sm">{error}</p>}
      {success && <p className="text-green-400 mb-3 text-sm">{success}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input name="driver_name" value={form.driver_name} onChange={handleChange} placeholder="Your name" className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700" required />
        <input name="car_model" value={form.car_model} onChange={handleChange} placeholder="Car model" className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700" />
        <input name="origin" value={form.origin} onChange={handleChange} placeholder="From" className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700" required />
        <input name="destination" value={form.destination} onChange={handleChange} placeholder="To" className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700" required />
        <div className="flex gap-3">
          <input type="number" min={1} name="seats_available" value={form.seats_available} onChange={handleChange} placeholder="Seats" className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700 w-full" required />
        </div>
        <input type="datetime-local" name="departure_time" value={form.departure_time} onChange={handleChange} className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700" required />
        <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact (phone/email)" className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700 sm:col-span-2" required />
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes (optional)" className="bg-slate-900/60 text-white rounded px-3 py-2 border border-slate-700 sm:col-span-2" rows={3} />
        <button disabled={loading} className="sm:col-span-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-2 rounded transition">
          {loading ? 'Posting...' : 'Post Ride'}
        </button>
      </form>
    </div>
  )
}
