import { useCart } from '../context/CartContext'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../components/firebase'
import { useNavigate, Link } from 'react-router-dom'

export default function Cart(){
  const { items, removeFromCart, updateQty, totals, clearCart } = useCart()
  const [user] = useAuthState(auth)
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent('/checkout') + '&reason=login-required')
      return
    }
    navigate('/checkout')
  }

  return (
    <main className="section">
      <div className="container" style={{maxWidth:900}}>
        <h2>Your Cart</h2>
        {items.length === 0 ? (
          <p className="lead">Your cart is empty.</p>
        ) : (
          <div style={{marginTop:12}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{textAlign:'left', borderBottom:'1px solid #e5e7eb'}}>
                  <th style={{padding:'8px 6px'}}>Product</th>
                  <th style={{padding:'8px 6px'}}>Price</th>
                  <th style={{padding:'8px 6px'}}>Qty</th>
                  <th style={{padding:'8px 6px'}}>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id} style={{borderBottom:'1px solid #f3f4f6'}}>
                    <td style={{padding:'10px 6px'}}>
                      <div style={{fontWeight:600}}>{i.name}</div>
                      <div className="meta">Code: {i.code}</div>
                    </td>
                    <td style={{padding:'10px 6px'}}>৳ {i.price.toFixed(2)}</td>
                    <td style={{padding:'10px 6px'}}>
                      <input 
                        type="number" 
                        min={1}
                        max={i.stock || 9999}
                        value={i.quantity}
                        onChange={(e)=>updateQty(i.id, Number(e.target.value))}
                        style={{width:70}}
                      />
                    </td>
                    <td style={{padding:'10px 6px'}}>৳ {(i.price * i.quantity).toFixed(2)}</td>
                    <td style={{padding:'10px 6px'}}>
                      <button className="btn btn-outline" onClick={()=>removeFromCart(i.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{display:'flex', justifyContent:'flex-end', marginTop:16}}>
              <div style={{minWidth:280}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span>Subtotal</span>
                  <strong>৳ {totals.subtotal.toFixed(2)}</strong>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <span>Shipping</span>
                  <strong>৳ {totals.shipping.toFixed(2)}</strong>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginTop:8, fontSize:18}}>
                  <span>Total</span>
                  <strong>৳ {totals.total.toFixed(2)}</strong>
                </div>
                <div style={{display:'flex', gap:8, marginTop:12}}>
                  <button className="btn btn-outline" onClick={clearCart}>Clear Cart</button>
                  <button className="btn btn-primary" onClick={handleCheckout}>
                    {user ? 'Checkout' : 'Login & Checkout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
