import { useCart } from '../context/CartContext'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../components/firebase'
import { useNavigate, Link } from 'react-router-dom'

export default function Cart(){
  const { items, removeFromCart, updateQty, totals, clearCart } = useCart()
  const [user] = useAuthState(auth)
  const navigate = useNavigate()

  const handleCheckout = () => {
    navigate('/checkout')
  }

  return (
    <main className="section">
      <div className="container" style={{maxWidth:900}}>
        <h2>Your Cart</h2>
        {items.length === 0 ? (
          <div style={{textAlign:'center', padding:'40px 20px'}}>
            <p className="lead">Your cart is empty.</p>
            <Link to="/shop" className="btn btn-primary" style={{marginTop:16}}>Continue Shopping</Link>
          </div>
        ) : (
          <div style={{marginTop:12}}>
            {/* Desktop table */}
            <div className="cart-table-wrapper">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(i => (
                    <tr key={i.id}>
                      <td>
                        <div style={{fontWeight:600}}>{i.name}</div>
                        <div className="meta">Code: {i.code}</div>
                      </td>
                      <td>৳ {i.price.toFixed(2)}</td>
                      <td>
                        <input 
                          type="number" 
                          min={1}
                          max={i.stock || 9999}
                          value={i.quantity}
                          onChange={(e)=>updateQty(i.id, Number(e.target.value))}
                          className="cart-qty-input"
                        />
                      </td>
                      <td>৳ {(i.price * i.quantity).toFixed(2)}</td>
                      <td>
                        <button className="btn btn-outline" onClick={()=>removeFromCart(i.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card layout */}
            <div className="cart-mobile-cards">
              {items.map(i => (
                <div key={i.id} className="cart-mobile-card">
                  <div style={{fontWeight:600, fontSize:'1.1rem', marginBottom:8}}>{i.name}</div>
                  <div className="meta" style={{marginBottom:12}}>Code: {i.code}</div>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12}}>
                    <div>
                      <div className="meta">Price</div>
                      <div style={{fontWeight:600}}>৳ {i.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="meta">Quantity</div>
                      <input 
                        type="number" 
                        min={1}
                        max={i.stock || 9999}
                        value={i.quantity}
                        onChange={(e)=>updateQty(i.id, Number(e.target.value))}
                        className="cart-qty-input"
                        style={{width:'100%', maxWidth:100}}
                      />
                    </div>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:'1px solid #f3f4f6'}}>
                    <div>
                      <div className="meta">Subtotal</div>
                      <div style={{fontWeight:700, fontSize:'1.1rem'}}>৳ {(i.price * i.quantity).toFixed(2)}</div>
                    </div>
                    <button className="btn btn-outline" onClick={()=>removeFromCart(i.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-wrapper">
              <div className="cart-summary">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
                  <span>Subtotal</span>
                  <strong>৳ {totals.subtotal.toFixed(2)}</strong>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
                  <span>Shipping</span>
                  <strong>৳ {totals.shipping.toFixed(2)}</strong>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginTop:12, paddingTop:12, borderTop:'2px solid #e5e7eb', fontSize:18}}>
                  <span style={{fontWeight:600}}>Total</span>
                  <strong>৳ {totals.total.toFixed(2)}</strong>
                </div>
                <div className="cart-actions">
                  <button className="btn btn-outline" onClick={clearCart}>Clear Cart</button>
                  <button className="btn btn-primary" onClick={handleCheckout}>
                    Proceed to Checkout
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
