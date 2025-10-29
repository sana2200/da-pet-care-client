import React, { useState, useMemo, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useNotification } from '../context/NotificationContext'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../components/firebase'
import { useNavigate } from 'react-router-dom'

let products = []
let categoryEmoji = {}
try {
  // prefer generated full list if present
  // eslint-disable-next-line import/no-unresolved
  const full = await import('../data/products_full.js')
  products = full.products
  categoryEmoji = full.categoryEmoji
} catch (e) {
  const base = await import('../data/products.js')
  products = base.products
  categoryEmoji = base.categoryEmoji
}

export default function Shop(){
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20
  const { addToCart } = useCart()
  const { showSuccess, showError } = useNotification()
  const [user] = useAuthState(auth)
  const navigate = useNavigate()

  const allCategories = useMemo(() => {
    const fromEmoji = Object.keys(categoryEmoji || {})
    const fromProducts = Array.from(new Set((products || []).map(p => p.category))).filter(Boolean)
    return ['All', ...Array.from(new Set([...fromEmoji, ...fromProducts]))]
  }, [])

  // filtered products by category
  const filtered = useMemo(() => {
    if (!products) return []
    if (category === 'All') return products
    return products.filter(p => p.category === category)
  }, [category])

  // reset page when category changes
  useEffect(() => setPage(1), [category])

  const totalPages = Math.max(1, Math.ceil((filtered || []).length / PAGE_SIZE))

  const pageProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return (filtered || []).slice(start, start + PAGE_SIZE)
  }, [page, filtered])

  function handleAdd(p){
    if(p.stock <= 0) {
      showError('This product is out of stock', {
        title: 'Cannot Add to Cart'
      })
      return
    }
    addToCart(p, 1)
    showSuccess(`${p.name} added to cart! 🛒`, {
      title: 'Added to Cart'
    })
  }

  function handleBuyNow(p){
    if(p.stock <= 0) {
      showError('This product is out of stock', {
        title: 'Cannot Purchase'
      })
      return
    }
    if(!user){
      navigate(`/auth?redirect=${encodeURIComponent('/cart')}&reason=login-required`)
      return
    }
    addToCart(p, 1)
    showSuccess(`${p.name} added to cart! Redirecting to checkout...`, {
      title: 'Added to Cart'
    })
    navigate('/cart')
  }

  return (
    <main className="section">
      <div className="container">
        <h2>Products</h2>
        <p className="lead">Emoji-first product cards. Click a product to view or buy.</p>

        <div style={{display:'flex', gap:12, alignItems:'center', marginTop:12, flexWrap:'wrap'}}>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`btn ${cat === category ? 'btn-primary' : 'btn-outline'}`}
              style={{textTransform:'capitalize'}}
            >
              {categoryEmoji[cat] || (cat === 'All' ? '📚' : '📦')} {cat}
            </button>
          ))}
        </div>

        <div style={{marginTop:12}}>
          <small>Showing {((page - 1) * PAGE_SIZE) + 1} - {Math.min(page * PAGE_SIZE, (filtered || []).length)} of {(filtered || []).length} items</small>
        </div>

        <div className="grid" style={{marginTop:16}}>
          {pageProducts.length === 0 && (<div style={{padding:24}}>No products found for "{category}".</div>)}
          {pageProducts.map((p)=> (
            <article className="card col-4 product" key={p.id}>
              <div style={{display:'grid', placeItems:'center', height:140, background:'#fff'}}>
                <span style={{fontSize:52}}>{categoryEmoji[p.category] || '📦'}</span>
              </div>
              <div className="body">
                <h3 className="title">{p.name}</h3>
                <p className="meta">Code: {p.code} · {p.category}</p>
                <p style={{marginTop:8, fontWeight:700}}>৳ {Number(p.price).toFixed(2)}</p>
                <p style={{color: p.stock <= 0 ? '#e11d48' : '#10b981'}}>{p.stock > 0 ? `In stock: ${p.stock}` : 'Out of stock'}</p>
                <div className="actions" style={{marginTop:8, display:'flex', gap:8}}>
                  <button 
                    className="btn btn-primary" 
                    disabled={p.stock <= 0}
                    onClick={() => handleBuyNow(p)}
                  >
                    {p.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                  </button>
                  <button 
                    className="btn btn-outline" 
                    disabled={p.stock <= 0}
                    onClick={() => handleAdd(p)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{display:'flex', gap:8, alignItems:'center', justifyContent:'center', marginTop:20}}>
          <button className="btn btn-outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <div>Page {page} / {totalPages}</div>
          <button className="btn btn-outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </main>
  )
}
