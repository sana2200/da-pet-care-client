import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../components/firebase'
import { api } from '../services/api'
import { useNotification } from '../context/NotificationContext'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Services(){
  const [showModal, setShowModal] = useState(false)
  const [prefillService, setPrefillService] = useState('')
  const [user] = useAuthState(auth)
  const navigate = useNavigate()
  const location = useLocation()
  const { showSuccess, showError } = useNotification()
  
  // Form state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function openModal(service){ 
    setPrefillService(service || ''); setShowModal(true) 
  }

  function goFullForm(service){
    const target = service ? `/book?service=${encodeURIComponent(service)}` : '/book'
    navigate(target)
  }
  
    function closeModal() {
      setShowModal(false)
      setName('')
      setPhone('')
      setEmail('')
      setDate('')
      setTime('')
      setApiError('')
      setSubmitted(false)
    }
  
    async function handleBookingSubmit(e) {
      e.preventDefault()
      if (!prefillService || !name || !phone) {
        setApiError('Please fill in all required fields')
        return
      }
  
      try {
        setLoading(true)
        setApiError('')
      
        const booking = {
          serviceName: prefillService,
          customerName: name,
          phone,
          email,
          appointmentDate: date || new Date().toISOString().slice(0,10),
          appointmentTime: time || '10:00',
          notes: 'Requested from services page',
        }
  
        const result = await api.bookings.create(booking)
        if (result && (result._id || result.booking)) {
          setSubmitted(true)
          showSuccess('Appointment request submitted successfully! 🎉', {
            title: 'Booking Requested',
            duration: 6000
          })
          setTimeout(() => {
            closeModal()
            // Optionally redirect to dashboard if user is logged in
            if (user) {
              navigate('/dashboard')
            }
          }, 2000)
        } else {
          throw new Error('Unexpected response from server')
        }
      } catch (err) {
        console.error('Booking error:', err)
        const errorMessage = err.message || 'Failed to create booking. Please try again.'
        setApiError(errorMessage)
        showError(errorMessage, {
          title: 'Booking Failed',
          duration: 8000
        })
      } finally {
        setLoading(false)
      }
    }

  return (
    <main className="section">
      <div className="container">
        <h2>Our Services</h2>
        <p className="lead">Comprehensive, compassionate care — tailored to your pet.</p>

        <div className="grid mt-16">
          {/* Vet Consultancy */}
          <article
            className="card col-6"
            role="button"
            tabIndex={0}
            onClick={()=>openModal('Vet Consultancy')}
            onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openModal('Vet Consultancy') } }}
            style={{cursor:'pointer'}}
          >
            <div style={{display:'grid', placeItems:'center', height:160, background:'#ecfeff'}}>
              <span style={{fontSize:64}}>🩺</span>
            </div>
            <div className="body">
              <div className="icon">🩺</div>
              <h3 className="title">Vet Consultancy</h3>
              <p className="meta">Nose-to-tail exams, health advice, diet and lifestyle guidance.</p>
                <div className="actions mt-12">
                  <button 
                    className="btn btn-primary" 
                    style={{fontSize:'14px', padding:'6px 12px'}}
                    onClick={(e) => {e.stopPropagation(); openModal('Vet Consultancy')}}
                  >
                    Quick Book
                  </button>
                  <Link 
                    className="btn btn-outline" 
                    style={{fontSize:'14px', padding:'6px 12px', marginLeft:'8px'}}
                      to="#"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); goFullForm('Vet Consultancy') }}
                  >
                    Full Form
                  </Link>
                </div>
            </div>
          </article>

          {/* Surgery */}
          <article
            className="card col-6"
            role="button"
            tabIndex={0}
            onClick={()=>openModal('Surgery')}
            onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openModal('Surgery') } }}
            style={{cursor:'pointer'}}
          >
            <div style={{display:'grid', placeItems:'center', height:160, background:'#eef2ff'}}>
              <span style={{fontSize:64}}>⚕️</span>
            </div>
            <div className="body">
              <div className="icon">⚕️</div>
              <h3 className="title">Surgery</h3>
              <p className="meta">Spay/neuter and soft-tissue procedures with careful monitoring.</p>
                <div className="actions" style={{marginTop:12}}>
                  <button 
                    className="btn btn-primary" 
                    style={{fontSize:'14px', padding:'6px 12px'}}
                    onClick={(e) => {e.stopPropagation(); openModal('Surgery')}}
                  >
                    Quick Book
                  </button>
                  <Link 
                    className="btn btn-outline" 
                    style={{fontSize:'14px', padding:'6px 12px', marginLeft:'8px'}}
                      to="#"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); goFullForm('Surgery') }}
                  >
                    Full Form
                  </Link>
                </div>
            </div>
          </article>

          {/* Vaccination */}
          <article
            className="card col-6"
            role="button"
            tabIndex={0}
            onClick={()=>openModal('Vaccination')}
            onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openModal('Vaccination') } }}
            style={{cursor:'pointer'}}
          >
            <div style={{display:'grid', placeItems:'center', height:160, background:'#f0fdf4'}}>
              <span style={{fontSize:64}}>💉</span>
            </div>
            <div className="body">
              <div className="icon">💉</div>
              <h3 className="title">Vaccination</h3>
              <p className="meta">Core schedule and boosters to protect against common diseases.</p>
                <div className="actions" style={{marginTop:12}}>
                  <button 
                    className="btn btn-primary" 
                    style={{fontSize:'14px', padding:'6px 12px'}}
                    onClick={(e) => {e.stopPropagation(); openModal('Vaccination')}}
                  >
                    Quick Book
                  </button>
                  <Link 
                    className="btn btn-outline" 
                    style={{fontSize:'14px', padding:'6px 12px', marginLeft:'8px'}}
                      to="#"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); goFullForm('Vaccination') }}
                  >
                    Full Form
                  </Link>
                </div>
            </div>
          </article>

          {/* Grooming */}
          <article
            className="card col-6"
            role="button"
            tabIndex={0}
            onClick={()=>openModal('Grooming')}
            onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openModal('Grooming') } }}
            style={{cursor:'pointer'}}
          >
            <div style={{display:'grid', placeItems:'center', height:160, background:'#fff7ed'}}>
              <span style={{fontSize:64}}>🧴</span>
            </div>
            <div className="body">
              <div className="icon">🧴</div>
              <h3 className="title">Grooming</h3>
              <p className="meta">Bath, fur trim, ear cleaning and nail clipping — gentle handling.</p>
                <div className="actions" style={{marginTop:12}}>
                  <button 
                    className="btn btn-primary" 
                    style={{fontSize:'14px', padding:'6px 12px'}}
                    onClick={(e) => {e.stopPropagation(); openModal('Grooming')}}
                  >
                    Quick Book
                  </button>
                  <Link 
                    className="btn btn-outline" 
                    style={{fontSize:'14px', padding:'6px 12px', marginLeft:'8px'}}
                      to="#"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); goFullForm('Grooming') }}
                  >
                    Full Form
                  </Link>
                </div>
            </div>
          </article>

          {/* Laboratory work */}
          <article
            className="card col-6"
            role="button"
            tabIndex={0}
            onClick={()=>openModal('Laboratory work')}
            onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openModal('Laboratory work') } }}
            style={{cursor:'pointer'}}
          >
            <div style={{display:'grid', placeItems:'center', height:160, background:'#fef9c3'}}>
              <span style={{fontSize:64}}>🧪</span>
            </div>
            <div className="body">
              <div className="icon">🧪</div>
              <h3 className="title">Laboratory work</h3>
              <p className="meta">On-site tests and imaging for faster, accurate diagnosis.</p>
                <div className="actions" style={{marginTop:12}}>
                  <button 
                    className="btn btn-primary" 
                    style={{fontSize:'14px', padding:'6px 12px'}}
                    onClick={(e) => {e.stopPropagation(); openModal('Laboratory work')}}
                  >
                    Quick Book
                  </button>
                  <Link 
                    className="btn btn-outline" 
                    style={{fontSize:'14px', padding:'6px 12px', marginLeft:'8px'}}
                      to="#"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); goFullForm('Laboratory work') }}
                  >
                    Full Form
                  </Link>
                </div>
            </div>
          </article>
        </div>
        {/* Single Book Appointment card */}
        <div style={{marginTop:24, display:'flex', justifyContent:'center'}}>
          <article className="card col-6" style={{maxWidth:720}}>
            <div style={{display:'grid', placeItems:'center', height:160, background:'#fff7fb'}}>
              <span style={{fontSize:64}}>📅</span>
            </div>
            <div className="body" style={{textAlign:'center'}}>
              <h3 className="title">Book Appointment</h3>
              <p className="meta">Schedule Vet Consultancy, Surgery, Vaccination, Grooming or Laboratory work. Click below to choose a time and enter your contact details.</p>
              <div className="actions" style={{marginTop:12, justifyContent:'center'}}>
             <button className="btn btn-primary" onClick={()=>openModal('')}>Quick Book</button>
             <Link className="btn btn-outline" to="#" onClick={(e)=>{e.preventDefault(); goFullForm('')}}>Full Booking Form</Link>
              </div>
            </div>
          </article>
        </div>
        {showModal && (
          <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'grid', placeItems:'center', zIndex:60}}>
            <div style={{width:'min(760px, 96%)', background:'#fff', borderRadius:8, padding:20}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h3>Book Appointment</h3>
                  <button className="btn btn-outline" onClick={closeModal}>Close</button>
              </div>
              
                {submitted ? (
                  <div style={{marginTop:16, textAlign:'center', padding:'20px 0'}}>
                    <div style={{fontSize:48}}>✅</div>
                    <h4 style={{color:'#16a34a', marginTop:8}}>Appointment Requested!</h4>
                    <p>We've received your request and will contact you to confirm the appointment.</p>
                  </div>
                ) : (
              <div style={{marginTop:8}}>
                  {apiError && (
                    <div style={{
                      background:'#fee2e2', 
                      color:'#b91c1c', 
                      padding:'12px', 
                      borderRadius:'6px',
                      marginBottom:'16px'
                    }}>
                      {apiError}
                    </div>
                  )}
                
                  <form onSubmit={handleBookingSubmit}>
                  <label className="field">
                    <div className="label">Service</div>
                      <select 
                        value={prefillService} 
                        onChange={(ev)=>setPrefillService(ev.target.value)}
                        required
                      >
                      <option value="">-- Choose a service --</option>
                      <option>Vet Consultancy</option>
                      <option>Surgery</option>
                      <option>Vaccination</option>
                      <option>Grooming</option>
                      <option>Laboratory work</option>
                    </select>
                  </label>
                  <label className="field">
                    <div className="label">Name</div>
                    <input 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                    />
                  </label>
                  <label className="field">
                    <div className="label">Phone <span style={{color:'#dc2626'}}>*</span></div>
                    <input 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                    />
                  </label>
                  <label className="field">
                    <div className="label">Email (optional)</div>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} />
                  </label>
                  <div style={{display:'flex', gap:12}}>
                    <label className="field" style={{flex:1}}>
                      <div className="label">Preferred date</div>
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </label>
                    <label className="field" style={{flex:1}}>
                      <div className="label">Preferred time</div>
                      <input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </label>
                  </div>
                  <div style={{marginTop:12}}>
                    <button 
                      className="btn btn-primary" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Request Appointment'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      style={{marginLeft:8}} 
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
