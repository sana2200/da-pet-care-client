import { auth, googleProvider } from './firebase'
import { signInWithPopup } from 'firebase/auth'

// Core helper: call this to trigger Google sign-in
export async function signInWithGoogle(){
  try{
    const result = await signInWithPopup(auth, googleProvider)
    return { user: result.user }
  }catch(err){
    // normalize common errors
    const code = err?.code || ''
    const friendly = {
      'auth/popup-closed-by-user': 'Sign-in popup closed',
      'auth/cancelled-popup-request': 'Popup request cancelled',
      'auth/network-request-failed': 'Network error, try again',
    }
    return { error: friendly[code] || err?.message || 'Google sign-in failed' }
  }
}

// Optional ready-made button. Usage: <GoogleSignInButton onSuccess={(user)=>...} onError={(msg)=>...} disabled={bool} />
export const GoogleSignInButton = ({ onSuccess, onError, disabled }) => {
  async function handle(){
    const { user, error } = await signInWithGoogle()
    if(error){ onError?.(error) }
    else { onSuccess?.(user) }
  }
  return (
    <button type="button" className="btn btn-outline" onClick={handle} disabled={disabled}>
      Continue with Google
    </button>
  )
}
