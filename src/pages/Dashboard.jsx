import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../components/firebase';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    bookings: [],
    orders: [],
    services: [],
    stats: {
      totalBookings: 0,
      upcomingBookings: 0,
      totalOrders: 0,
      totalSpent: 0
    }
  });
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setApiLoading(true);
      setError('');

      // Load all dashboard data in parallel
      const [profileData, bookingsData, ordersData, servicesData] = await Promise.all([
        api.users.getProfile().catch(() => null),
        api.users.getBookings().catch(() => []),
        api.users.getOrders().catch(() => []),
        api.services.getAll().catch(() => [])
      ]);

      const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.bookings || []);
      const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.orders || []);
      
      // Calculate stats
      const now = new Date();
      const upcomingBookings = bookings.filter(booking => {
        const appointmentDate = new Date(booking.appointmentDate);
        return appointmentDate >= now && booking.status !== 'cancelled';
      }).length;

      const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setDashboardData({
        profile: profileData,
        bookings: bookings.slice(0, 5), // Recent 5
        orders: orders.slice(0, 5), // Recent 5
        services: servicesData.slice(0, 6), // Top 6
        stats: {
          totalBookings: bookings.length,
          upcomingBookings,
          totalOrders: orders.length,
          totalSpent
        }
      });

    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError('Failed to load dashboard data: ' + err.message);
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
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': '#22c55e',
      'pending': '#f59e0b', 
      'cancelled': '#ef4444',
      'completed': '#6366f1',
      'processing': '#3b82f6',
      'shipped': '#10b981',
      'delivered': '#22c55e'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return <div className="section"><div className="container">Loading...</div></div>;
  }

  if (!user) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Dashboard</h2>
          <p>Please <Link to="/auth" className="link">log in</Link> to view your dashboard.</p>
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            Dashboard
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9, 
            marginBottom: 0,
            color: 'white'
          }}>
            Welcome back, {user.displayName || dashboardData.profile?.name || user.email?.split('@')[0]}! 👋
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#dc2626', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        {apiLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '1.5rem', 
              marginBottom: '3rem' 
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                transition: 'transform 0.2s ease',
                cursor: 'default'
              }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0px)'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📅</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {dashboardData.stats.totalBookings}
                </div>
                <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Total Bookings</div>
              </div>
              
              <div style={{ 
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                transition: 'transform 0.2s ease',
                cursor: 'default'
              }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0px)'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⏰</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {dashboardData.stats.upcomingBookings}
                </div>
                <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Upcoming Appointments</div>
              </div>
              
              <div style={{ 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
                transition: 'transform 0.2s ease',
                cursor: 'default'
              }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0px)'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛒</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {dashboardData.stats.totalOrders}
                </div>
                <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Total Orders</div>
              </div>
              
              <div style={{ 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
                transition: 'transform 0.2s ease',
                cursor: 'default'
              }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0px)'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {formatCurrency(dashboardData.stats.totalSpent)}
                </div>
                <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Total Spent</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ 
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '3rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9'
            }}>
              <h3 style={{ 
                marginBottom: '1.5rem', 
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ⚡ Quick Actions
              </h3>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <Link 
                  to="/book" 
                  style={{ 
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
                  }}
                >
                  📅 Book Appointment
                </Link>
                <Link 
                  to="/shop" 
                  style={{ 
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  🛒 Shop Products
                </Link>
                <Link 
                  to="/profile" 
                  style={{ 
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
                  }}
                >
                  👤 Edit Profile
                </Link>
                <Link 
                  to="/services" 
                  style={{ 
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
                  }}
                >
                  🏥 View Services
                </Link>
                <Link 
                  to="/orders" 
                  style={{ 
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.3)';
                  }}
                >
                  📦 View Orders
                </Link>
                <Link 
                  to="/bookings" 
                  style={{ 
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
                  }}
                >
                  📅 View Bookings
                </Link>
              </div>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Recent Bookings */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '2px solid #f1f5f9'
                }}>
                  <h3 style={{ 
                    fontSize: '1.4rem',
                    fontWeight: '600',
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: 0
                  }}>
                    📅 Recent Bookings
                  </h3>
                  <Link 
                    to="/bookings" 
                    style={{ 
                      fontSize: '0.9rem', 
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontWeight: '500',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#eff6ff'}
                    onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                  >
                    View All →
                  </Link>
                </div>
                
                {dashboardData.bookings.length > 0 ? (
                  <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {dashboardData.bookings.map((booking, index) => (
                      <div key={booking._id || index} style={{ 
                        padding: '1rem', 
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0', 
                        borderRadius: '12px', 
                        marginBottom: '0.75rem',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => {
                        e.target.style.backgroundColor = '#f1f5f9';
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.backgroundColor = '#f8fafc';
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.transform = 'translateY(0px)';
                      }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontWeight: '600', 
                              fontSize: '1rem',
                              color: '#1e293b',
                              marginBottom: '0.25rem'
                            }}>
                              {booking.serviceName}
                            </div>
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              🗓️ {formatDate(booking.appointmentDate)} 
                              <span style={{ color: '#94a3b8' }}>•</span>
                              🕐 {booking.appointmentTime}
                            </div>
                          </div>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '20px', 
                            fontSize: '0.75rem', 
                            fontWeight: '600',
                            backgroundColor: getStatusColor(booking.status) + '15',
                            color: getStatusColor(booking.status),
                            border: `1px solid ${getStatusColor(booking.status)}30`,
                            textTransform: 'capitalize'
                          }}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem 1rem', 
                    color: '#64748b',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '2px dashed #cbd5e1'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      No bookings yet
                    </div>
                    <Link 
                      to="/book"
                      style={{
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontWeight: '600'
                      }}
                    >
                      Book your first appointment! →
                    </Link>
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '2px solid #f1f5f9'
                }}>
                  <h3 style={{ 
                    fontSize: '1.4rem',
                    fontWeight: '600',
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: 0
                  }}>
                    🛒 Recent Orders
                  </h3>
                  <Link 
                    to="/orders" 
                    style={{ 
                      fontSize: '0.9rem', 
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontWeight: '500',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#eff6ff'}
                    onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                  >
                    View All →
                  </Link>
                </div>
                
                {dashboardData.orders.length > 0 ? (
                  <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {dashboardData.orders.map((order, index) => (
                      <div key={order._id || index} style={{ 
                        padding: '1rem', 
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0', 
                        borderRadius: '12px', 
                        marginBottom: '0.75rem',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => {
                        e.target.style.backgroundColor = '#f1f5f9';
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.backgroundColor = '#f8fafc';
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.transform = 'translateY(0px)';
                      }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontWeight: '600', 
                              fontSize: '1rem',
                              color: '#1e293b',
                              marginBottom: '0.25rem'
                            }}>
                              Order #{order._id?.slice(-6) || 'N/A'}
                            </div>
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              📦 {order.items?.length || 0} items 
                              <span style={{ color: '#94a3b8' }}>•</span>
                              🗓️ {formatDate(order.createdAt)}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ 
                              fontWeight: '700', 
                              fontSize: '1.1rem',
                              color: '#1e293b',
                              marginBottom: '0.25rem'
                            }}>
                              {formatCurrency(order.totalAmount)}
                            </div>
                            <span style={{ 
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '20px', 
                              fontSize: '0.75rem', 
                              fontWeight: '600',
                              backgroundColor: getStatusColor(order.status) + '15',
                              color: getStatusColor(order.status),
                              border: `1px solid ${getStatusColor(order.status)}30`,
                              textTransform: 'capitalize'
                            }}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem 1rem', 
                    color: '#64748b',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '2px dashed #cbd5e1'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      No orders yet
                    </div>
                    <Link 
                      to="/shop"
                      style={{
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontWeight: '600'
                      }}
                    >
                      Start shopping! →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Available Services */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              marginTop: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid #f1f5f9'
              }}>
                <h3 style={{ 
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: 0
                }}>
                  🏥 Our Services
                </h3>
                <Link 
                  to="/services" 
                  style={{ 
                    fontSize: '0.9rem', 
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = '#eff6ff'}
                  onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                >
                  View All Services →
                </Link>
              </div>
              
              {dashboardData.services.length > 0 ? (
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '1.5rem' 
                }}>
                  {dashboardData.services.map((service, index) => (
                    <div key={service._id || index} style={{ 
                      padding: '1.5rem', 
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      border: '1px solid #e2e8f0', 
                      borderRadius: '16px',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={e => {
                      e.target.style.transform = 'translateY(-5px)';
                      e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                      e.target.style.borderColor = '#cbd5e1';
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = 'translateY(0px)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        height: '4px',
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
                        borderRadius: '16px 16px 0 0'
                      }}></div>
                      
                      <div style={{ 
                        fontSize: '2rem', 
                        marginBottom: '1rem'
                      }}>
                        🏥
                      </div>
                      
                      <div style={{ 
                        fontWeight: '600', 
                        fontSize: '1.1rem',
                        color: '#1e293b',
                        marginBottom: '0.75rem',
                        lineHeight: '1.4'
                      }}>
                        {service.name}
                      </div>
                      
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#64748b', 
                        marginBottom: '1rem',
                        lineHeight: '1.5',
                        minHeight: '3rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {service.description || 'Professional pet care service'}
                      </div>
                      
                      <div style={{ 
                        fontWeight: '700', 
                        fontSize: '1.5rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '1.5rem'
                      }}>
                        {formatCurrency(service.price || 0)}
                      </div>
                      
                      <Link 
                        to={`/book?service=${encodeURIComponent(service.name)}`}
                        style={{ 
                          display: 'inline-block',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                          color: 'white',
                          textDecoration: 'none',
                          fontSize: '0.9rem', 
                          fontWeight: '600',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '10px',
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
                        📅 Book Now
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem', 
                  color: '#64748b',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '2px dashed #cbd5e1'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏥</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                    Loading services...
                  </div>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button 
                onClick={loadDashboardData}
                disabled={apiLoading}
                style={{
                  background: apiLoading ? '#e2e8f0' : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                  color: apiLoading ? '#64748b' : 'white',
                  border: 'none',
                  padding: '0.875rem 2rem',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: apiLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  margin: '0 auto',
                  boxShadow: apiLoading ? 'none' : '0 4px 15px rgba(100, 116, 139, 0.3)'
                }}
                onMouseEnter={e => {
                  if (!apiLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(100, 116, 139, 0.4)';
                  }
                }}
                onMouseLeave={e => {
                  if (!apiLoading) {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(100, 116, 139, 0.3)';
                  }
                }}
              >
                {apiLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #cbd5e1',
                      borderTop: '2px solid #64748b',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    🔄 Refresh Dashboard
                  </>
                )}
              </button>
            </div>
            
            {/* Add CSS animation for loading spinner */}
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </>
        )}
      </div>
    </div>
  );
}