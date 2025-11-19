import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../components/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNotification } from '../context/NotificationContext'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotification()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    
    if (!form.email.trim() || !form.password) {
      showError('Please enter both email and password', { title: 'Validation Error' })
      return
    }

    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password)
      const user = userCredential.user
      
      // Check if user has admin claim
      const tokenResult = await user.getIdTokenResult(true)
      const isAdmin = tokenResult.claims?.isAdmin || false

      if (isAdmin) {
        showSuccess('Welcome back, Admin! 👋', { title: 'Login Successful' })
        navigate('/admin', { replace: true })
      } else {
        // Not an admin, sign them out
        await auth.signOut()
        showError('Access denied. Admin privileges required.', { 
          title: 'Unauthorized',
          duration: 5000 
        })
      }
    } catch (err) {
      console.error('Admin login error:', err)
      const errorMessage = mapFirebaseError(err)
      showError(errorMessage, { title: 'Login Failed' })
    } finally {
      setLoading(false)
    }
  }

  function mapFirebaseError(err) {
    const code = err?.code || ''
    const map = {
      'auth/invalid-credential': 'Invalid email or password',
      'auth/invalid-email': 'Invalid email address',
      'auth/user-not-found': 'No admin account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many failed attempts. Try again later',
      'auth/network-request-failed': 'Network error. Check your connection'
    }
    return map[code] || 'Login failed. Please try again.'
  }

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 500 }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '32px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔐</div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: 'white'
          }}>
            Admin Portal
          </h1>
          <p style={{ opacity: 0.9, color: 'white' }}>
            Secure access for administrators only
          </p>
        </div>

        <form onSubmit={onSubmit} className="form">
          <h2 style={{ 
            fontSize: '1.5rem', 
            textAlign: 'center', 
            marginBottom: '24px',
            color: '#1e293b'
          }}>
            Admin Login
          </h2>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 600,
              color: '#334155'
            }}>
              Admin Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="admin@dapetcare.com"
              className="input"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 600,
              color: '#334155'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={onChange}
                placeholder="Enter your admin password"
                className="input"
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#64748b'
                }}
                disabled={loading}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: 600,
              background: loading ? '#94a3b8' : '#667eea',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '🔄 Authenticating...' : '🔓 Login as Admin'}
          </button>

          <div style={{ 
            marginTop: '20px', 
            textAlign: 'center',
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748b', 
              margin: 0 
            }}>
              <strong>⚠️ Admin Access Only</strong><br />
              This area is restricted to authorized administrators.
            </p>
          </div>

          <div style={{ 
            marginTop: '16px', 
            textAlign: 'center' 
          }}>
            <Link 
              to="/" 
              style={{ 
                color: '#667eea', 
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
