import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../components/firebase';
import { api } from '../services/api';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [order, setOrder] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?redirect=' + encodeURIComponent(`/orders/${id}`) + '&reason=login-required');
    }
  }, [user, loading, navigate, id]);

  useEffect(() => {
    if (user && id) {
      loadOrder();
    }
  }, [user, id]);

  const loadOrder = async () => {
    try {
      setApiLoading(true);
      setError('');
      const orderData = await api.orders.getById(id);
      setOrder(orderData);
    } catch (err) {
      console.error('Error loading order:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setApiLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f59e0b',
      'processing': '#3b82f6',
      'shipped': '#10b981',
      'delivered': '#22c55e',
      'cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': '⏳',
      'processing': '🔄',
      'shipped': '🚚',
      'delivered': '✅',
      'cancelled': '❌'
    };
    return icons[status] || '📦';
  };

  if (loading || apiLoading) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', color: '#dc2626' }}>❌</div>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error Loading Order</h2>
          <p style={{ marginBottom: '2rem' }}>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📦</div>
          <h2 style={{ marginBottom: '1rem' }}>Order Not Found</h2>
          <p style={{ marginBottom: '2rem' }}>The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '2.5rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: '12px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              color: 'white'
            }}>
              Order #{order.orderNumber}
            </h1>
            <p style={{ 
              fontSize: '1rem', 
              opacity: 0.9, 
              marginBottom: 0,
              color: 'white'
            }}>
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: getStatusColor(order.orderStatus) + '20',
            border: `2px solid ${getStatusColor(order.orderStatus)}`,
            borderRadius: '20px',
            color: 'white',
            fontWeight: '600',
            textTransform: 'capitalize',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {getStatusIcon(order.orderStatus)} {order.orderStatus}
          </div>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Order Items */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <h3 style={{ 
              fontSize: '1.4rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📦 Order Items ({order.items?.length || 0})
            </h3>

            <div style={{ space: '1rem' }}>
              {order.items?.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  marginBottom: '1rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '1rem',
                      color: '#1e293b',
                      marginBottom: '0.25rem'
                    }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <span>Qty: {item.quantity}</span>
                      <span>•</span>
                      <span>৳{item.price.toFixed(2)} each</span>
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: '700', 
                    fontSize: '1.1rem',
                    color: '#1e293b'
                  }}>
                    ৳{item.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div style={{ 
              borderTop: '2px solid #f1f5f9',
              paddingTop: '1.5rem',
              marginTop: '1.5rem'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: '#64748b' }}>Subtotal:</span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>৳{order.subtotal?.toFixed(2)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: '#64748b' }}>Shipping:</span>
                <span style={{ color: '#1e293b', fontWeight: '600' }}>৳{order.shippingCost?.toFixed(2)}</span>
              </div>
              {order.tax > 0 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ color: '#64748b' }}>Tax:</span>
                  <span style={{ color: '#1e293b', fontWeight: '600' }}>৳{order.tax?.toFixed(2)}</span>
                </div>
              )}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f1f5f9',
                fontSize: '1.2rem',
                fontWeight: '700'
              }}>
                <span style={{ color: '#1e293b' }}>Total:</span>
                <span style={{ color: '#059669' }}>৳{order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Info & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Delivery Information */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9'
            }}>
              <h4 style={{ 
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🏠 Delivery Address
              </h4>
              
              <div style={{ space: '0.5rem' }}>
                <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                  {order.shippingAddress?.name}
                </div>
                <div style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                  {order.shippingAddress?.address}
                </div>
                <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📱 {order.shippingAddress?.phone}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9'
            }}>
              <h4 style={{ 
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                💳 Payment Info
              </h4>
              
              <div style={{ space: '0.75rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ color: '#64748b' }}>Method:</span>
                  <span style={{ 
                    color: '#1e293b', 
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    💵 {order.paymentMethod?.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#64748b' }}>Status:</span>
                  <span style={{ 
                    color: order.paymentStatus === 'paid' ? '#059669' : '#f59e0b',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {order.paymentStatus === 'paid' ? '✅' : '⏳'} {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            {order.estimatedDelivery && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f1f5f9'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🚚 Delivery Info
                </h4>
                
                <div style={{ 
                  color: '#64748b',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem'
                }}>
                  Estimated Delivery:
                </div>
                <div style={{ 
                  color: '#1e293b',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  📅 {formatDate(order.estimatedDelivery)}
                </div>
              </div>
            )}

            {/* Order Notes */}
            {order.notes && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f1f5f9'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📝 Order Notes
                </h4>
                
                <div style={{ 
                  color: '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  {order.notes}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                }}
              >
                👤 Back to Dashboard
              </button>
              
              <button
                onClick={() => navigate('/shop')}
                style={{
                  background: 'transparent',
                  color: '#64748b',
                  border: '2px solid #e2e8f0',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={e => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.color = '#3b82f6';
                }}
                onMouseLeave={e => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.color = '#64748b';
                }}
              >
                🛒 Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}