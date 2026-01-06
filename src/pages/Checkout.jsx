import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../components/firebase';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const { items, totals, clearCart } = useCart();
  const { showSuccess, showError } = useNotification();
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cash_on_delivery',
    notes: ''
  });

  // Allow guest checkout - no authentication required

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !success) {
      navigate('/shop');
    }
  }, [items.length, navigate, success]);

  // Load user profile data if logged in
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const profile = await api.users.getProfile();
      if (profile) {
        setFormData(prev => ({
          ...prev,
          name: profile.name || user.displayName || '',
          phone: profile.phone || '',
          address: profile.address || ''
        }));
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      // Use Firebase user data as fallback
      setFormData(prev => ({
        ...prev,
        name: user.displayName || user.email?.split('@')[0] || '',
        phone: '',
        address: ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Please enter your delivery address');
      return false;
    }
    return true;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setOrderLoading(true);
      setError('');

      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      // Create order
      const order = await api.orders.create(orderData);
      
      if (order && order._id) {
        setSuccess(true);
        clearCart();
        showSuccess('Order placed successfully! 🎉', {
          title: 'Order Confirmed',
          duration: 6000
        });
        
        // Redirect to order confirmation after 3 seconds
        setTimeout(() => {
          navigate(`/orders/${order._id}`);
        }, 3000);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      const errorMessage = err.message || 'Failed to create order. Please try again.';
      setError(errorMessage);
      showError(errorMessage, {
        title: 'Order Failed',
        duration: 8000
      });
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '16px',
            padding: '3rem',
            color: 'white',
            marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>
              Order Placed Successfully!
            </h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, color: 'white' }}>
              Thank you for your order. You will receive a confirmation call within 24 hours.
            </p>
          </div>
          <div style={{ 
            fontSize: '1rem', 
            color: '#64748b',
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            🔄 Redirecting to order details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '2.5rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            color: 'white'
          }}>
            Checkout
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9, 
            marginBottom: 0,
            color: 'white'
          }}>
            Complete your order 🛒
          </p>
        </div>

        {/* Guest checkout notice */}
        {!user && (
          <div style={{
            background: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>ℹ️</span>
            <div style={{ flex: 1 }}>
              <strong>Guest Checkout</strong>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#92400e' }}>
                You're checking out as a guest. 
                <button
                  onClick={() => navigate('/auth?redirect=' + encodeURIComponent('/checkout'))}
                  style={{
                    marginLeft: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#1e40af',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Sign in
                </button>
                {' '}to save your details and track orders.
              </p>
            </div>
          </div>
        )}

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '2rem',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Checkout Form */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📝 Order Details
            </h3>

            {error && (
              <div style={{ 
                backgroundColor: '#fee2e2', 
                color: '#dc2626', 
                padding: '1rem', 
                borderRadius: '12px', 
                marginBottom: '2rem',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmitOrder}>
              {/* Personal Information */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ 
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  👤 Personal Information
                </h4>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ 
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🏠 Delivery Address
                </h4>
                
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  placeholder="Enter your complete delivery address..."
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 1rem', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ 
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  💳 Payment Method
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: formData.paymentMethod === 'cash_on_delivery' ? '#eff6ff' : 'transparent'
                  }}
                  onMouseEnter={e => e.target.style.borderColor = '#3b82f6'}
                  onMouseLeave={e => e.target.style.borderColor = formData.paymentMethod === 'cash_on_delivery' ? '#3b82f6' : '#e5e7eb'}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={handleInputChange}
                      style={{ accentColor: '#3b82f6' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>💵 Cash on Delivery</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Pay when your order arrives</div>
                    </div>
                  </label>
                  
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    opacity: 0.6,
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online_payment"
                      disabled
                      style={{ accentColor: '#3b82f6' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>💳 Online Payment</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Coming Soon</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ 
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📝 Order Notes (Optional)
                </h4>
                
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any special instructions for delivery..."
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 1rem', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    resize: 'vertical'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={orderLoading || items.length === 0}
                style={{
                  width: '100%',
                  background: orderLoading ? '#e2e8f0' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: orderLoading ? '#64748b' : 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: orderLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: orderLoading ? 'none' : '0 4px 15px rgba(34, 197, 94, 0.3)'
                }}
                onMouseEnter={e => {
                  if (!orderLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.4)';
                  }
                }}
                onMouseLeave={e => {
                  if (!orderLoading) {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)';
                  }
                }}
              >
                {orderLoading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #cbd5e1',
                      borderTop: '2px solid #64748b',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    🛒 Place Order (৳{totals.total.toFixed(2)})
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9',
            height: 'fit-content'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📋 Order Summary
            </h3>

            {/* Cart Items */}
            <div style={{ marginBottom: '1.5rem' }}>
              {items.map((item, index) => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: index < items.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1e293b' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      Qty: {item.quantity} × ৳{item.price.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#1e293b',
                    fontSize: '0.95rem'
                  }}>
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ 
              borderTop: '2px solid #f1f5f9',
              paddingTop: '1rem'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: '#64748b' }}>Subtotal:</span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>৳{totals.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: '#64748b' }}>Shipping:</span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>৳{totals.shipping.toFixed(2)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f1f5f9',
                fontSize: '1.1rem',
                fontWeight: '700'
              }}>
                <span style={{ color: '#1e293b' }}>Total:</span>
                <span style={{ color: '#059669' }}>৳{totals.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div style={{ 
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ 
                fontSize: '0.875rem',
                color: '#166534',
                fontWeight: '600',
                marginBottom: '0.25rem'
              }}>
                📦 Estimated Delivery
              </div>
              <div style={{ fontSize: '0.875rem', color: '#15803d' }}>
                2-3 business days
              </div>
            </div>
          </div>
        </div>

        {/* Add CSS animation for loading spinner */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}