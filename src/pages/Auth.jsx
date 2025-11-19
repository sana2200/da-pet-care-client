import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { auth, db } from '../components/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { signInWithGoogle } from '../components/signinWithGoogle'

export default function Auth(){
  const navigate = useNavigate()
  const location = useLocation()
  const initialMode = (new URLSearchParams(location.search).get('mode')) || 'login'
  const redirectParam = new URLSearchParams(location.search).get('redirect')
  const redirectTo = (redirectParam && redirectParam.startsWith('/')) ? redirectParam : '/'
  const reason = new URLSearchParams(location.search).get('reason')
  const [mode, setMode] = useState(initialMode) // 'login' | 'register'
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    address: '',
    agree: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (reason === 'login-required') {
      setToast('Please login to continue your booking')
      const t = setTimeout(() => setToast(''), 3500)
      return () => clearTimeout(t)
    }
  }, [reason])

  function onChange(e){
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function validate(){
    const errs = {}
    const emailRe = /[^\s@]+@[^\s@]+\.[^\s@]+/
  if(mode === 'register' && !form.name.trim()) errs.name = 'Name is required'
  if(mode === 'register' && !form.phone.trim()) errs.phone = 'Phone is required'
  if(mode === 'register' && !form.address.trim()) errs.address = 'Address is required'
    if(!form.email.trim()) errs.email = 'Email is required'
    else if(!emailRe.test(form.email)) errs.email = 'Enter a valid email'
    if(!form.password) errs.password = 'Password is required'
    else if(form.password.length < 6) errs.password = 'Min 6 characters'
    if(mode === 'register'){
      if(!form.confirm) errs.confirm = 'Confirm your password'
      else if(form.confirm !== form.password) errs.confirm = 'Passwords do not match'
      if(!form.agree) errs.agree = 'Please accept terms'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function onSubmit(e){
    e.preventDefault()
    if(!validate()) return
    setServerError('')
    setLoading(true)
    try{
      if(mode === 'login'){
        await signInWithEmailAndPassword(auth, form.email, form.password)
      } else {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
        if(form.name){
          await updateProfile(cred.user, { displayName: form.name })
        }
        // Persist profile to Firestore
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          createdAt: serverTimestamp(),
        })
      }
      navigate(redirectTo, { replace: true })
    }catch(err){
      console.error(err)
      setServerError(mapFirebaseError(err))
    }finally{
      setLoading(false)
    }
  }

  function mapFirebaseError(err){
    const code = err?.code || ''
    const map = {
      'auth/invalid-credential': 'Invalid email or password',
      'auth/invalid-email': 'Invalid email address',
      'auth/email-already-in-use': 'Email already in use',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/popup-closed-by-user': 'Sign-in popup closed',
      'auth/network-request-failed': 'Network error, try again',
    }
    return map[code] || err?.message || 'Something went wrong'
  }

  async function handleGoogle(){
    setServerError('')
    setLoading(true)
    const { user, error } = await signInWithGoogle()
    if(error){
      setServerError(error)
      setLoading(false)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="section">
      <div className="container">
        {toast && (
          <div style={{
            position:'fixed',
            top:24,
            right:24,
            background:'linear-gradient(90deg,#22c55e 0%,#38bdf8 100%)',
            color:'#fff',
            padding:'14px 22px',
            borderRadius:12,
            boxShadow:'0 8px 32px rgba(34,197,94,.18)',
            zIndex:100,
            display:'flex',
            alignItems:'center',
            gap:16,
            fontWeight:600,
            fontSize:16,
            letterSpacing:'0.01em',
            border:'2px solid #fff',
            animation:'fadeIn .3s'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:8}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            <span>{toast}</span>
            <button onClick={()=>setToast('')} style={{background:'rgba(255,255,255,0.15)', color:'#fff', border:'none', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontWeight:500}}>Dismiss</button>
          </div>
        )}
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="lead">{mode === 'login' ? 'Log in to manage your bookings and shop orders.' : 'Join us to book services, shop pet products, and more.'}</p>

        <div className="form" role="form" aria-label={mode === 'login' ? 'Login form' : 'Register form'}>
          <div className="grid" style={{marginBottom:12, alignItems:'center'}}>
            <div className="col-12" style={{display:'flex', gap:8, background:'#f1f5f9', padding:6, borderRadius:12}}>
              <button type="button" onClick={()=>setMode('login')} className={`btn ${mode==='login'?'btn-primary':'btn-outline'}`} aria-pressed={mode==='login'}>Login</button>
              <button type="button" onClick={()=>setMode('register')} className={`btn ${mode==='register'?'btn-primary':'btn-outline'}`} aria-pressed={mode==='register'}>Register</button>
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate>
            {mode === 'register' && (
              <>
                <div style={{marginBottom:12}}>
                  <label htmlFor="name" style={{display:'block', fontWeight:600, marginBottom:6}}>Full name</label>
                  <input id="name" name="name" className="input" value={form.name} onChange={onChange} placeholder="Jane Doe" />
                  {errors.name && <p className="meta" style={{color:'#ef4444', marginTop:6}}>{errors.name}</p>}
                </div>

                <div className="row" style={{marginBottom:12}}>
                  <div>
                    <label htmlFor="phone" style={{display:'block', fontWeight:600, marginBottom:6}}>Phone number</label>
                    <input id="phone" name="phone" className="input" value={form.phone} onChange={onChange} placeholder="e.g. +880 1XXXXXXXXX" />
                    {errors.phone && <p className="meta" style={{color:'#ef4444', marginTop:6}}>{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="address" style={{display:'block', fontWeight:600, marginBottom:6}}>Address</label>
                    <input id="address" name="address" className="input" value={form.address} onChange={onChange} placeholder="Street, City, ZIP" />
                    {errors.address && <p className="meta" style={{color:'#ef4444', marginTop:6}}>{errors.address}</p>}
                  </div>
                </div>
              </>
            )}

            <div className="row">
              <div>
                <label htmlFor="email" style={{display:'block', fontWeight:600, marginBottom:6}}>Email</label>
                <input id="email" type="email" name="email" className="input" value={form.email} onChange={onChange} placeholder="you@example.com" />
                {errors.email && <p className="meta" style={{color:'#ef4444', marginTop:6}}>{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" style={{display:'block', fontWeight:600, marginBottom:6}}>Password</label>
                <div style={{position:'relative'}}>
                  <input id="password" type={showPwd ? 'text' : 'password'} name="password" className="input" value={form.password} onChange={onChange} placeholder="••••••••" />
                  <button
                    type="button"
                    onClick={()=>setShowPwd(s=>!s)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                    className="meta"
                    style={{position:'absolute', right:10, top:10, color:'var(--brand)', display:'grid', placeItems:'center'}}
                  >
                    {showPwd ? (
                      // Eye-off icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-4.48 0-8.27-2.94-9.54-7a10.78 10.78 0 0 1 2.06-3.36"/>
                        <path d="M6.06 6.06A10.94 10.94 0 0 1 12 4c4.48 0 8.27 2.94 9.54 7a10.78 10.78 0 0 1-2.06 3.36"/>
                        <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      // Eye icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="meta" style={{color:'#ef4444', marginTop:6}}>{errors.password}</p>}
              </div>
            </div>

            {mode === 'register' && (
              <div style={{marginTop:12}}>
                <label htmlFor="confirm" style={{display:'block', fontWeight:600, marginBottom:6}}>Confirm password</label>
                <div style={{position:'relative'}}>
                  <input id="confirm" type={showConfirm ? 'text' : 'password'} name="confirm" className="input" value={form.confirm} onChange={onChange} placeholder="••••••••" />
                  <button
                    type="button"
                    onClick={()=>setShowConfirm(s=>!s)}
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    className="meta"
                    style={{position:'absolute', right:10, top:10, color:'var(--brand)', display:'grid', placeItems:'center'}}
                  >
                    {showConfirm ? (
                      // Eye-off icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-4.48 0-8.27-2.94-9.54-7a10.78 10.78 0 0 1 2.06-3.36"/>
                        <path d="M6.06 6.06A10.94 10.94 0 0 1 12 4c4.48 0 8.27 2.94 9.54 7a10.78 10.78 0 0 1-2.06 3.36"/>
                        <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      // Eye icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirm && <p className="meta" style={{color:'#ef4444', marginTop:6}}>{errors.confirm}</p>}
              </div>
            )}

            {serverError && <p className="meta" style={{color:'#ef4444', marginTop:6}}>{serverError}</p>}

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12, gap:8, flexWrap:'wrap'}}>
              {mode === 'login' ? (
                <Link to="#" className="meta" style={{color:'var(--brand)'}}>Forgot password?</Link>
              ) : (
                <label style={{display:'flex', alignItems:'center', gap:8}}>
                  <input type="checkbox" name="agree" checked={form.agree} onChange={onChange} />
                  <span className="meta">I agree to the <Link to="#" style={{color:'var(--brand)'}}>Terms</Link></span>
                </label>
              )}

              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create account')}
              </button>
              <button className="btn btn-outline" type="button" onClick={handleGoogle} disabled={loading} style={{display:'inline-flex', alignItems:'center', gap:8}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.676 6.053 29.574 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/>
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.655 16.217 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.676 6.053 29.574 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.196-5.238C29.217 35.091 26.715 36 24 36c-5.202 0-9.62-3.317-11.281-7.946l-6.531 5.027C9.5 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.79 2.23-2.231 4.166-3.894 5.565.001-.001 6.196 5.238 6.196 5.238C39.353 36.423 44 30.678 44 24c0-1.341-.138-2.651-.389-3.917z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div style={{marginTop:14}} className="meta">
              {mode === 'login' ? (
                <>Don&apos;t have an account? <button type="button" onClick={()=>setMode('register')} style={{color:'var(--brand)', fontWeight:600}}>Register</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={()=>setMode('login')} style={{color:'var(--brand)', fontWeight:600}}>Login</button></>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
