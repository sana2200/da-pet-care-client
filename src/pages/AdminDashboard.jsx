import React, { useEffect, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../components/firebase';
import { Navigate } from 'react-router-dom';
import { getAllBookings, getAllProducts, sendConfirmationEmail, deleteProduct, updateProduct, addProduct, getAllServices, addService, updateService, deleteService } from "../api/admin";

export default function AdminDashboard() {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({ name: "", price: "", duration: "" });

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
    if (isAdmin) {
      getAllBookings().then(setBookings);
      getAllProducts().then(setProducts);
      getAllServices().then(setServices);
    }
    return () => { cancelled = true };
  }, [user, isAdmin]);

  const handleSendEmail = async (bookingId) => {
    setEmailLoading(true);
    try {
      await sendConfirmationEmail(bookingId);
      setEmailStatus("Email sent!");
    } catch {
      setEmailStatus("Failed to send email.");
    }
    setEmailLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      setEmailStatus("Product deleted successfully");
    } catch (error) {
      setEmailStatus(`Error: ${error.message}`);
    }
  };

  const handleUpdateProduct = async (product) => {
    try {
      await updateProduct(product);
      setEditingProduct(null);
      getAllProducts().then(setProducts);
      setEmailStatus("Product updated successfully");
    } catch (error) {
      setEmailStatus(`Error: ${error.message}`);
    }
  };

  const handleAddProduct = async () => {
    try {
      await addProduct(newProduct);
      setNewProduct({ name: "", price: "", stock: "" });
      getAllProducts().then(setProducts);
      setEmailStatus("Product added successfully");
    } catch (error) {
      setEmailStatus(`Error: ${error.message}`);
    }
  };

  const handleUpdateService = async (service) => {
    try {
      await updateService(service);
      setEditingService(null);
      getAllServices().then(setServices);
      setEmailStatus("Service updated successfully");
    } catch (error) {
      setEmailStatus(`Error: ${error.message}`);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteService(id);
      setServices(services.filter(s => s._id !== id));
      setEmailStatus("Service deleted successfully");
    } catch (error) {
      setEmailStatus(`Error: ${error.message}`);
    }
  };

  const handleAddService = async () => {
    try {
      const payload = { ...newService, price: parseFloat(newService.price||0), duration: parseInt(newService.duration||0) };
      await addService(payload);
      setNewService({ name: "", price: "", duration: "" });
      getAllServices().then(setServices);
      setEmailStatus("Service added successfully");
    } catch (error) {
      setEmailStatus(`Error: ${error.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div style={{padding:32,color:'#ef4444'}}>Access denied. Admins only.</div>;
  return (
    <div className="admin-dashboard" style={{padding:'20px', maxWidth:'1200px', margin:'0 auto'}}>
      <h1 style={{color:'#22c55e', marginBottom:'30px'}}>Admin Dashboard</h1>
      <section>
        <h2>Bookings</h2>
        <ul>
          {bookings.map(b => (
            <li key={b._id} style={{display:'flex',gap:12,alignItems:'center',justifyContent:'space-between'}}>
              <span>
                <b>{b.serviceName}</b>
                {` — ${new Date(b.appointmentDate).toLocaleDateString()} ${b.appointmentTime || ''}`}
                {` — Pet: ${b.petName || '-'} (${b.petType || '-'})`}
                {` — Status: ${b.status}`}
              </span>
              <div style={{display:'flex',gap:8}}>
                <button onClick={() => setSelectedBooking(b)}>Details</button>
                <button onClick={() => handleSendEmail(b._id)} disabled={emailLoading}>Send Confirmation</button>
              </div>
            </li>
          ))}
        </ul>
        {emailStatus && <div>{emailStatus}</div>}
        {selectedBooking && (
          <div className="booking-details">
            <h3>Booking Details</h3>
            <pre>{JSON.stringify(selectedBooking, null, 2)}</pre>
            <button onClick={() => setSelectedBooking(null)}>Close</button>
          </div>
        )}
      </section>
      <section style={{marginBottom:'40px', padding:'20px', border:'1px solid #e5e7eb', borderRadius:'8px'}}>
        <h2 style={{color:'#374151', marginBottom:'20px'}}>Manage Products</h2>
        <ul style={{listStyle:'none', padding:0}}>
          {products.map(p => (
            <li key={p._id} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:12,alignItems:'center',padding:'15px',border:'1px solid #f3f4f6',borderRadius:'6px',marginBottom:'10px',background:'#fafafa'}}>
              {editingProduct === p._id ? (
                <form onSubmit={e => { e.preventDefault(); handleUpdateProduct(p); }} style={{display:'flex',gap:8,alignItems:'center'}}>
                  <input value={p.name} onChange={e => setProducts(products.map(prod => prod._id === p._id ? { ...prod, name: e.target.value } : prod))} />
                  <input type="number" step="0.01" value={p.price} onChange={e => setProducts(products.map(prod => prod._id === p._id ? { ...prod, price: e.target.value } : prod))} />
                  <input type="number" value={p.stock} onChange={e => setProducts(products.map(prod => prod._id === p._id ? { ...prod, stock: e.target.value } : prod))} />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <span style={{fontSize:'16px',fontWeight:'500'}}>{p.name} - ${p.price} - Stock: {p.stock}</span>
                  <div style={{display:'flex',gap:8}}>
                    <button style={{background:'#3b82f6',color:'white',border:'none',padding:'8px 16px',borderRadius:'4px',cursor:'pointer'}} onClick={() => setEditingProduct(p._id)}>✏️ Edit</button>
                    <button style={{background:'#ef4444',color:'white',border:'none',padding:'8px 16px',borderRadius:'4px',cursor:'pointer'}} onClick={() => handleDeleteProduct(p._id)}>🗑️ Delete</button>
                    <button onClick={async () => { 
                      try {
                        const updated = { ...p, stock: (parseInt(p.stock)||0)+1 }; 
                        setProducts(products.map(x=>x._id===p._id?updated:x)); 
                        await updateProduct(updated);
                        setEmailStatus("Stock increased");
                      } catch (error) {
                        setEmailStatus(`Error: ${error.message}`);
                      }
                    }}>+1</button>
                    <button style={{background:'#f59e0b',color:'white',border:'none',padding:'6px 12px',borderRadius:'4px',cursor:'pointer'}} onClick={async () => { 
                      try {
                        const updated = { ...p, stock: Math.max(0,(parseInt(p.stock)||0)-1) }; 
                        setProducts(products.map(x=>x._id===p._id?updated:x)); 
                        await updateProduct(updated);
                        setEmailStatus("Stock decreased");
      } catch (error) {
                        setEmailStatus(`Error: ${error.message}`);
                      }
                    }}>-1</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <h3>Add Product</h3>
        <form onSubmit={e => { e.preventDefault(); handleAddProduct(); }}>
          <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
          <input placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
          <input placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
          <button type="submit">Add</button>
        </form>
      </section>
      <section style={{marginBottom:'40px', padding:'20px', border:'1px solid #e5e7eb', borderRadius:'8px'}}>
        <h2 style={{color:'#374151', marginBottom:'20px'}}>Manage Services</h2>
        <ul style={{listStyle:'none', padding:0}}>
          {services.map(s => (
            <li key={s._id} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:12,alignItems:'center',padding:'15px',border:'1px solid #f3f4f6',borderRadius:'6px',marginBottom:'10px',background:'#fafafa'}}>
              {editingService === s._id ? (
                <form onSubmit={e => { e.preventDefault(); handleUpdateService(s); }} style={{display:'flex',gap:8,alignItems:'center'}}>
                  <input value={s.name} onChange={e => setServices(services.map(x => x._id===s._id?{...x,name:e.target.value}:x))} />
                  <input type="number" step="0.01" value={s.price} onChange={e => setServices(services.map(x => x._id===s._id?{...x,price:e.target.value}:x))} />
                  <input type="number" value={s.duration} onChange={e => setServices(services.map(x => x._id===s._id?{...x,duration:e.target.value}:x))} />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingService(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <span style={{fontSize:'16px',fontWeight:'500'}}>{s.name} - ${s.price} - {s.duration} min</span>
                  <div style={{display:'flex',gap:8}}>
                    <button style={{background:'#3b82f6',color:'white',border:'none',padding:'8px 16px',borderRadius:'4px',cursor:'pointer'}} onClick={() => setEditingService(s._id)}>✏️ Edit</button>
                    <button style={{background:'#ef4444',color:'white',border:'none',padding:'8px 16px',borderRadius:'4px',cursor:'pointer'}} onClick={() => handleDeleteService(s._id)}>🗑️ Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <h3>Add Service</h3>
        <form onSubmit={e => { e.preventDefault(); handleAddService(); }} style={{display:'flex',gap:8,alignItems:'center'}}>
          <input placeholder="Name" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} />
          <input placeholder="Price" type="number" step="0.01" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} />
          <input placeholder="Duration (min)" type="number" value={newService.duration} onChange={e => setNewService({ ...newService, duration: e.target.value })} />
          <button type="submit">Add</button>
        </form>
      </section>
    </div>
  );
}
