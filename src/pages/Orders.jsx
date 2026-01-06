import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../components/firebase';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Orders() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?redirect=' + encodeURIComponent('/orders') + '&reason=login-required');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setApiLoading(true);
      setError('');
      const ordersData = await api.orders.getAll();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setApiLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount).replace('$', '৳');
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
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div style={{ 
          marginBottom: '2.5rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
            My Orders
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9, 
            marginBottom: 0,
            color: 'white'
          }}>
            Track and manage your purchases 📦
          </p>
        </div>

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
            <button 
              onClick={loadOrders}
              style={{
                marginLeft: 'auto',
                background: 'transparent',
                color: '#dc2626',
                border: '1px solid #dc2626',
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {orders.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📦</div>
            <h3 style={{ 
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              No Orders Yet
            </h3>
            <p style={{ 
              color: '#64748b',
              fontSize: '1rem',
              marginBottom: '2rem',
              maxWidth: '400px',
              margin: '0 auto 2rem'
            }}>
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link 
              to="/shop"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
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
              🛒 Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Orders Summary */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#3b82f6',
                    marginBottom: '0.25rem'
                  }}>
                    {orders.length}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Orders</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#10b981',
                    marginBottom: '0.25rem'
                  }}>
                    {orders.filter(o => o.orderStatus === 'delivered').length}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Delivered</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#f59e0b',
                    marginBottom: '0.25rem'
                  }}>
                    {orders.filter(o => ['pending', 'processing'].includes(o.orderStatus)).length}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem' }}>In Progress</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#059669',
                    marginBottom: '0.25rem'
                  }}>
                    {formatCurrency(orders.reduce((sum, order) => sum + (order.total || 0), 0))}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Spent</div>
                </div>
              </div>
            </div>

            {/* Orders List */}
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
                📋 Order History
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map((order) => (
                  <div 
                    key={order._id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      backgroundColor: '#fafafa'
                    }}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    onMouseEnter={e => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.transform = 'translateY(0px)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      {/* Order Info */}
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '0.75rem',
                          marginBottom: '0.75rem'
                        }}>
                          <div style={{ 
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            color: '#1e293b'
                          }}>
                            Order #{order.orderNumber}
                          </div>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '20px', 
                            fontSize: '0.75rem', 
                            fontWeight: '600',
                            backgroundColor: getStatusColor(order.orderStatus) + '15',
                            color: getStatusColor(order.orderStatus),
                            border: `1px solid ${getStatusColor(order.orderStatus)}30`,
                            textTransform: 'capitalize',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            {getStatusIcon(order.orderStatus)} {order.orderStatus}
                          </span>
                        </div>
                        
                        <div style={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem',
                          fontSize: '0.875rem',
                          color: '#64748b'
                        }}>
                          <div>📅 Placed on {formatDate(order.createdAt)}</div>
                          <div>📦 {order.items?.length || 0} items</div>
                          {order.estimatedDelivery && (
                            <div>🚚 Est. delivery: {formatDate(order.estimatedDelivery)}</div>
                          )}
                        </div>
                      </div>

                      {/* Order Total */}
                      <div style={{ 
                        textAlign: 'right',
                        minWidth: '120px'
                      }}>
                        <div style={{ 
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          color: '#059669',
                          marginBottom: '0.25rem'
                        }}>
                          {formatCurrency(order.total)}
                        </div>
                        <div style={{ 
                          fontSize: '0.75rem',
                          color: '#64748b',
                          textTransform: 'uppercase',
                          fontWeight: '600'
                        }}>
                          {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Online Payment'}
                        </div>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div style={{ 
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      <div style={{ 
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#64748b'
                      }}>
                        {order.items?.slice(0, 3).map((item, index) => (
                          <span key={index}>
                            {item.name} (×{item.quantity})
                            {index < Math.min(2, order.items.length - 1) && ', '}
                          </span>
                        ))}
                        {order.items?.length > 3 && (
                          <span>... and {order.items.length - 3} more items</span>
                        )}
                      </div>
                    </div>

                    {/* Action Indicator */}
                    <div style={{
                      marginTop: '1rem',
                      fontSize: '0.875rem',
                      color: '#3b82f6',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      Click to view details →
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

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