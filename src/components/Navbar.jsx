import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import { useCart } from '../context/CartContext'
import logoImage from '../Images/Logo.png'
const defaultLogo = logoImage
const fallback1 = '/petcarelogo.webp'
const fallback2 = '/petlogo.jpg'

export default function Navbar(){
  const { items } = useCart()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const [src, setSrc] = useState(defaultLogo)
  const [open, setOpen] = useState(false)
  const [user, loading] = useAuthState(auth)
  const [isAdmin, setIsAdmin] = useState(false)
  const dropdownRef = useRef(null)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Read admin claim from Firebase token
  useEffect(() => {
    let cancelled = false;
    async function checkClaims() {
      try {
        if (!user) { setIsAdmin(false); return; }
        const tokenResult = await user.getIdTokenResult(true);
        if (!cancelled) setIsAdmin(!!tokenResult.claims?.isAdmin || user?.role === 'admin');
      } catch(e) {
        if (!cancelled) setIsAdmin(false);
      }
    }
    checkClaims();
    return () => { cancelled = true };
  }, [user])

  function handleImgError(){
    if(src === defaultLogo) setSrc(fallback1)
    else if(src === fallback1) setSrc(fallback2)
  }

  return (
    <header className="header">
      <div className="container nav" role="navigation" aria-label="Primary">
        <div className="brand">
          <div className="logo">
            <Link to="/">
              <img src={src} alt="pet care logo" onError={handleImgError} style={{height:40, width:'auto', marginTop:4}} />
            </Link>
          </div>
          <Link to="/" className="link" style={{fontSize:'1.5rem'}} onClick={()=>setOpen(false)}>
            <span className="one">Dr.</span> Anwar's Pet Care
          </Link>
        </div>

        {/* mobile menu button kept for style parity; not wired for JS toggle */}
        <input
          type="checkbox"
          id="menu-toggle"
          checked={open}
          onChange={()=>setOpen(!open)}
          aria-hidden
          readOnly
        />
        <label
          htmlFor="menu-toggle"
          className="menu-btn"
          aria-label="Toggle Menu"
          aria-controls="primary-navigation"
          aria-expanded={open}
        >
          <span></span><span></span><span></span>
        </label>

  <ul id="primary-navigation" style={{alignItems:'center'}}>
          <li><NavLink onClick={()=>setOpen(false)} className={({isActive})=>`link ${isActive ? 'active':''}`} to="/">Home</NavLink></li>
          <li><NavLink onClick={()=>setOpen(false)} className={({isActive})=>`link ${isActive ? 'active':''}`} to="/services">Services</NavLink></li>
          <li style={{position:'relative'}}>
            <NavLink onClick={()=>setOpen(false)} className={({isActive})=>`link ${isActive ? 'active':''}`} to="/shop">Shop</NavLink>
            <Link to="/cart" style={{position:'absolute', top:-8, right:-18, textDecoration:'none'}} aria-label="Cart">
              <span style={{
                display:'inline-block',
                minWidth:22,
                height:22,
                background:'#22c55e',
                color:'#fff',
                fontWeight:700,
                fontSize:14,
                borderRadius:'50%',
                boxShadow:'0 2px 8px rgba(34,197,94,.15)',
                textAlign:'center',
                lineHeight:'22px',
                border:'2px solid #fff',
                transition:'background .2s',
                marginLeft:4
              }}>{cartCount > 0 ? cartCount : ''}</span>
            </Link>
          </li>
          <li><NavLink onClick={()=>setOpen(false)} className={({isActive})=>`link ${isActive ? 'active':''}`} to="/about">About</NavLink></li>
          <li><NavLink onClick={()=>setOpen(false)} className={({isActive})=>`link ${isActive ? 'active':''}`} to="/faq">FAQ</NavLink></li>
          <li><NavLink onClick={()=>setOpen(false)} className={({isActive})=>`link ${isActive ? 'active':''}`} to="/contact">Contact</NavLink></li>
          {!loading && (
            user ? (
              // User is logged in - show same button but as dropdown for user menu
              <li ref={dropdownRef} style={{position: 'relative'}}>
                <button
                  onClick={() => setOpen(!open)}
                  className="link cta solid-btn"
                  style={{
                    background: '#22c55e',
                    color: '#fff', 
                    fontWeight: 600,
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,.08)',
                    transition: 'background .2s',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      style={{width: '20px', height: '20px', borderRadius: '50%'}} 
                    />
                  ) : (
                    <div style={{
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      background: '#fff',
                      color: '#22c55e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  Account
                </button>
                {open && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    minWidth: '160px',
                    zIndex: 1000
                  }}>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                      onMouseEnter={e => e.target.style.background = '#f9fafb'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={() => setOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                      onMouseEnter={e => e.target.style.background = '#f9fafb'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: 'inherit'
                      }}
                      onMouseEnter={e => e.target.style.background = '#fef2f2'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </li>
            ) : (
              // User is not logged in - show Login/Register
              <li>
                <NavLink
                  onClick={()=>setOpen(false)}
                  className={({isActive})=>`link cta solid-btn ${isActive ? 'active':''}`}
                  to="/auth"
                  style={{
                    background: '#5efbceff',
                    color: '#174e6e', 
                    fontWeight: 600,
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,.08)',
                    transition: 'background .2s, color .2s',
                    filter: 'none',
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = '#4ecdc4';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = '#a7e3f4';
                    e.target.style.color = '#174e6e';
                  }}
                >
                  Login / Register
                </NavLink>
              </li>
            )
          )}
          {/* Admin links - only show if user is admin */}
          {user && isAdmin && (
            <>
              <li>
                <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Admin Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Admin Profile
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  )
}
