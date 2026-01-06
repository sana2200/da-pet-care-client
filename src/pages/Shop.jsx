import React, { useState, useMemo } from 'react'
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
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const PAGE_SIZE = 20
  const { addToCart } = useCart()
  const { showSuccess, showError } = useNotification()
  const [user] = useAuthState(auth)
  const navigate = useNavigate()

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products || []
    const query = searchQuery.toLowerCase()
    return (products || []).filter(p => 
      p.name?.toLowerCase().includes(query) || 
      p.code?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))

  const pageProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredProducts.slice(start, start + PAGE_SIZE)
  }, [page, filteredProducts])

  // Reset to page 1 when search changes
  useMemo(() => setPage(1), [searchQuery])

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
    addToCart(p, 1)
    showSuccess(`${p.name} added to cart! Redirecting to checkout...`, {
      title: 'Added to Cart'
    })
    navigate('/cart')
  }

  return (
    <main className="section">
      <div className="container">
        <h2 className="shop-title">
          <span className="shop-title-icon">🛍️</span>
          Our Products
          <span className="shop-title-icon">🐾</span>
        </h2>
        <p className="lead">Browse our curated selection of pet care products and supplies.</p>

        {/* Search Bar */}
        <div className="shop-search-wrapper">
          <div className="shop-search-container">
            <span className="shop-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products by name, code, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shop-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="shop-search-clear"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="mt-12">
          <small>Showing {((page - 1) * PAGE_SIZE) + 1} - {Math.min(page * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length} items</small>
        </div>

        <div className="grid mt-16">
          {pageProducts.length === 0 && (
            <div className="col-12" style={{padding:24, textAlign:'center'}}>
              {searchQuery ? `No products found matching "${searchQuery}"` : 'No products found.'}
            </div>
          )}
          {pageProducts.map((p)=> (
            <article className="card col-4 product" key={p.id}>
              <div style={{display:'grid', placeItems:'center', height:140, background:'#fff'}}>
                <span style={{fontSize:52}}>{categoryEmoji[p.category] || '📦'}</span>
              </div>
              <div className="body">
                <h3 className="title">{p.name}</h3>
                <p className="meta">Code: {p.code}</p>
                <p style={{marginTop:8, fontWeight:700}}>৳ {Number(p.price).toFixed(2)}</p>
                <p style={{color: p.stock <= 0 ? '#e11d48' : '#10b981'}}>{p.stock > 0 ? `In stock: ${p.stock}` : 'Out of stock'}</p>
                <div className="actions mt-8">
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

        <div className="pagination-controls">
          <button className="btn btn-outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <div style={{padding:'0 16px', whiteSpace:'nowrap'}}>Page {page} / {totalPages}</div>
          <button className="btn btn-outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </main>
  )
}
