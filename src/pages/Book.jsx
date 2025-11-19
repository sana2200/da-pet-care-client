import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../components/firebase'
import { api } from '../services/api'
import { useNotification } from '../context/NotificationContext'

export default function Book(){
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const prefill = params.get('service') || ''
  const [user, authLoading] = useAuthState(auth)
  const location = useLocation()

  // Service selection supports either backend-provided services (serviceId) or fallback by name
  const [services, setServices] = useState([])
  const [serviceId, setServiceId] = useState('')
  const [service, setService] = useState(prefill)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  // Extra fields for full form
  const [petName, setPetName] = useState('')
  const [petType, setPetType] = useState('')
  const [petAge, setPetAge] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const { showSuccess, showError } = useNotification()

  useEffect(()=>{
    if(prefill) setService(prefill)
  }, [prefill])

  // Require authentication: redirect to /auth with return URL
  useEffect(() => {
    if (!authLoading && !user) {
      const returnTo = location.pathname + location.search
      navigate(`/auth?redirect=${encodeURIComponent(returnTo)}&reason=login-required`, { replace: true })
    }
  }, [authLoading, user, location, navigate])

  // Fetch services from backend for serviceId support
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const list = await api.services.getAll()
        if (mounted && Array.isArray(list)) {
          setServices(list)
          // If prefill provided via query, try to map to ID
          if (prefill) {
            const match = list.find(s => (s.name || '').toLowerCase() === prefill.toLowerCase())
            if (match) {
              setServiceId(match._id)
            }
          }
        }
      } catch (e) {
        // Silently ignore; fallback to name-based selection
        console.warn('Failed to load services list; using fallback')
      }
    })()
    return () => { mounted = false }
  }, [prefill])

  function validate(){
    const e = {}
    if(!(serviceId || service)) e.service = 'Please select a service'
    if(!name) e.name = 'Please enter your name'
    if(!phone) e.phone = 'Please enter a phone number'
    return e
  }

  async function onSubmit(ev){
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    setApiError('')
    if(Object.keys(e).length) return

    try {
      setLoading(true)
      // Build booking payload
      const booking = {
        customerName: name,
        phone,
        email,
        appointmentDate: date || new Date().toISOString().slice(0,10),
        appointmentTime: time || '10:00',
        // Prefer serviceId if available; otherwise pass serviceName
        ...(serviceId ? { serviceId } : { serviceName: service }),
        // Extra fields for full form
        ...(petName && { petName }),
        ...(petType && { petType }),
        ...(petAge && { petAge }),
        notes: notes || 'Requested from website (full form)',
      }

      // Submit to backend
      const result = await api.bookings.create(booking)
      if (result && (result._id || result.booking)) {
        setSubmitted(true)
        showSuccess('Appointment booked successfully! 🎉', {
          title: 'Booking Confirmed',
          duration: 6000
        })
        setTimeout(()=> navigate('/dashboard'), 2500)
      } else {
        throw new Error('Unexpected response from server')
      }
    } catch (err) {
      console.error('Booking error:', err)
      const errorMessage = err.message || 'Failed to create booking'
      setApiError(errorMessage)
      showError(errorMessage, {
        title: 'Booking Failed',
        duration: 8000
      })
    } finally {
      setLoading(false)
    }
  }

  if(submitted){
    return (
      <main className="section">
        <div className="container" style={{textAlign:'center'}}>
          <h2>Appointment requested</h2>
          <p className="lead">Thanks — we've received your request. We'll contact you to confirm the appointment.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="section">
      <div className="container" style={{maxWidth:680}}>
        <h2>Book Appointment</h2>
        <p className="lead">Select a service and preferred date/time. We'll confirm availability.</p>

        <form onSubmit={onSubmit} style={{marginTop:12}}>
          {apiError && <div style={{color:'#b91c1c', marginBottom:12}}>{apiError}</div>}
          <label className="field">
            <div className="label">Service</div>
            {services.length > 0 ? (
              <select 
                value={serviceId}
                onChange={e=> setServiceId(e.target.value)}
              >
                <option value="">-- Choose a service --</option>
                {services.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            ) : (
              <select value={service} onChange={e=>setService(e.target.value)}>
                <option value="">-- Choose a service --</option>
                <option>Vet Consultancy</option>
                <option>Surgery</option>
                <option>Vaccination</option>
                <option>Grooming</option>
                <option>Laboratory work</option>
              </select>
            )}
            {errors.service && <div style={{color:'#e11d48'}}>{errors.service}</div>}
          </label>

          <label className="field">
            <div className="label">Name</div>
            <input value={name} onChange={e=>setName(e.target.value)} />
            {errors.name && <div style={{color:'#e11d48'}}>{errors.name}</div>}
          </label>

          <label className="field">
            <div className="label">Phone <span style={{color:'#dc2626'}}>*</span></div>
            <input value={phone} onChange={e=>setPhone(e.target.value)} required />
            {errors.phone && <div style={{color:'#e11d48'}}>{errors.phone}</div>}
          </label>

          <label className="field">
            <div className="label">Email (optional)</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} />
          </label>

          <div style={{display:'flex', gap:12}}>
            <label className="field" style={{flex:1}}>
              <div className="label">Preferred date</div>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
            </label>
            <label className="field" style={{flex:1}}>
              <div className="label">Preferred time</div>
              <input type="time" value={time} onChange={e=>setTime(e.target.value)} />
            </label>
          </div>

          {/* Full form exclusive fields */}
          <div style={{display:'flex', gap:12, marginTop:8}}>
            <label className="field" style={{flex:1}}>
              <div className="label">Pet Name (optional)</div>
              <input value={petName} onChange={e=>setPetName(e.target.value)} />
            </label>
            <label className="field" style={{flex:1}}>
              <div className="label">Pet Type</div>
              <select value={petType} onChange={e=>setPetType(e.target.value)}>
                <option value="">-- Select --</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>
          <div style={{display:'flex', gap:12}}>
            <label className="field" style={{flex:1}}>
              <div className="label">Pet Age</div>
              <input value={petAge} onChange={e=>setPetAge(e.target.value)} placeholder="e.g., 2 years" />
            </label>
            <label className="field" style={{flex:1}}>
              <div className="label">Additional Notes</div>
              <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Symptoms, preferences, etc." />
            </label>
          </div>

          <div style={{marginTop:12}}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Request Appointment'}</button>
            <a className="btn btn-outline" href="/contact" style={{marginLeft:8}}>Contact</a>
          </div>
        </form>
      </div>
    </main>
  )
}
