import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../components/firebase';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState('');
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setApiLoading(true);
      setError('');

      // Load user profile from backend
      const profileData = await api.users.getProfile();
      setProfile(profileData);

      // Load user bookings
  const bookingsData = await api.users.getBookings();
  setBookings(Array.isArray(bookingsData) ? bookingsData : (bookingsData.bookings || []));

      // Load user orders
  const ordersData = await api.users.getOrders();
  setOrders(Array.isArray(ordersData) ? ordersData : (ordersData.orders || []));

    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load profile data: ' + err.message);
    } finally {
      setApiLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      address: formData.get('address'),
    };

    try {
      const updatedProfile = await api.users.updateProfile(updates);
      setProfile(updatedProfile);
      showSuccess('Profile updated successfully! 🎉', {
        title: 'Profile Updated'
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      showError(err.message || 'Failed to update profile', {
        title: 'Update Failed'
      });
    }
  };

  if (loading) {
    return <div className="section"><div className="container">Loading...</div></div>;
  }

  if (!user) {
    return (
      <div className="section">
        <div className="container">
          <h2>Profile</h2>
          <p>Please log in to view your profile.</p>
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
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
            My Profile
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9, 
            marginBottom: 0,
            color: 'white'
          }}>
            Manage your account and preferences 👤
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
          </div>
        )}

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem', 
          marginBottom: '3rem' 
        }}>
          {/* Firebase User Info */}
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
              🔐 Authentication Info
            </h3>
            <div style={{ space: '1rem' }}>
              <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <strong style={{ color: '#475569' }}>Email:</strong> 
                <span style={{ marginLeft: '0.5rem', color: '#1e293b' }}>{user.email}</span>
              </div>
              <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <strong style={{ color: '#475569' }}>Email Verified:</strong> 
                <span style={{ 
                  marginLeft: '0.5rem', 
                  color: user.emailVerified ? '#059669' : '#dc2626',
                  fontWeight: '600'
                }}>
                  {user.emailVerified ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <strong style={{ color: '#475569' }}>Display Name:</strong> 
                <span style={{ marginLeft: '0.5rem', color: '#1e293b' }}>{user.displayName || 'Not set'}</span>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <strong style={{ color: '#475569' }}>Firebase UID:</strong> 
                <span style={{ 
                  marginLeft: '0.5rem', 
                  color: '#6b7280', 
                  fontSize: '0.875rem',
                  fontFamily: 'monospace'
                }}>
                  {user.uid.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>

          {/* Backend Profile */}
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
              💾 Database Profile
            </h3>
            {apiLoading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#64748b' 
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid #e2e8f0',
                  borderTop: '3px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                Loading profile data...
              </div>
            ) : profile ? (
              <div style={{ space: '1rem' }}>
                <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <strong style={{ color: '#475569' }}>Name:</strong> 
                  <span style={{ marginLeft: '0.5rem', color: '#1e293b' }}>{profile.name}</span>
                </div>
                <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <strong style={{ color: '#475569' }}>Phone:</strong> 
                  <span style={{ marginLeft: '0.5rem', color: '#1e293b' }}>{profile.phone || '📱 Not set'}</span>
                </div>
                <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <strong style={{ color: '#475569' }}>Address:</strong> 
                  <span style={{ marginLeft: '0.5rem', color: '#1e293b' }}>{profile.address || '🏠 Not set'}</span>
                </div>
                <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <strong style={{ color: '#475569' }}>MongoDB ID:</strong> 
                  <span style={{ 
                    marginLeft: '0.5rem', 
                    color: '#6b7280', 
                    fontSize: '0.875rem',
                    fontFamily: 'monospace'
                  }}>
                    {profile._id?.slice(0, 8)}...
                  </span>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <strong style={{ color: '#475569' }}>Member Since:</strong> 
                  <span style={{ marginLeft: '0.5rem', color: '#1e293b' }}>
                    📅 {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#64748b',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '2px dashed #cbd5e1'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                No backend profile found
              </div>
            )}
          </div>
        </div>

        {/* Update Profile Form */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '3rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #f1f5f9'
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
            ✏️ Update Profile
          </h3>
          <form onSubmit={updateProfile}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="name" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                👤 Full Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={profile?.name || ''}
                placeholder="Enter your full name"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#fafafa'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="phone" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                📱 Phone Number:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={profile?.phone || ''}
                placeholder="Enter your phone number"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#fafafa'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="address" style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                🏠 Address:
              </label>
              <textarea
                id="address"
                name="address"
                rows="4"
                defaultValue={profile?.address || ''}
                placeholder="Enter your complete address"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#fafafa',
                  resize: 'vertical',
                  minHeight: '100px'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <button 
              type="submit" 
              disabled={apiLoading}
              style={{
                background: apiLoading ? '#e2e8f0' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: apiLoading ? '#64748b' : 'white',
                border: 'none',
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: apiLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: apiLoading ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={e => {
                if (!apiLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseLeave={e => {
                if (!apiLoading) {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
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
                  Updating...
                </>
              ) : (
                <>
                  💾 Update Profile
                </>
              )}
            </button>
          </form>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* User's Bookings */}
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
              📅 My Bookings ({bookings.length})
            </h3>
            {apiLoading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#64748b' 
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid #e2e8f0',
                  borderTop: '3px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                Loading bookings...
              </div>
            ) : bookings.length > 0 ? (
              <div>
                {bookings.slice(0, 3).map((booking, index) => (
                  <div key={booking._id || index} style={{ 
                    padding: '1rem', 
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    marginBottom: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.transform = 'translateY(0px)';
                  }}
                  >
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#1e293b' }}>🏥 Service:</strong> 
                      <span style={{ marginLeft: '0.5rem', color: '#374151' }}>{booking.serviceName}</span>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#1e293b' }}>📅 Date:</strong> 
                      <span style={{ marginLeft: '0.5rem', color: '#374151' }}>
                        {new Date(booking.appointmentDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: '#1e293b' }}>📊 Status:</strong> 
                      <span style={{ 
                        marginLeft: '0.5rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: booking.status === 'confirmed' ? '#dcfce7' : booking.status === 'pending' ? '#fef3c7' : '#fee2e2',
                        color: booking.status === 'confirmed' ? '#166534' : booking.status === 'pending' ? '#92400e' : '#991b1b'
                      }}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
                {bookings.length > 3 && (
                  <p style={{ 
                    textAlign: 'center', 
                    color: '#64748b', 
                    fontStyle: 'italic',
                    marginTop: '1rem'
                  }}>
                    ...and {bookings.length - 3} more bookings
                  </p>
                )}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#64748b',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '2px dashed #cbd5e1'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                No bookings found
              </div>
            )}
          </div>

          {/* User's Orders */}
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
              🛒 My Orders ({orders.length})
            </h3>
            {apiLoading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#64748b' 
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid #e2e8f0',
                  borderTop: '3px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                Loading orders...
              </div>
            ) : orders.length > 0 ? (
              <div>
                {orders.slice(0, 3).map((order, index) => (
                  <div key={order._id || index} style={{ 
                    padding: '1rem', 
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    marginBottom: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.transform = 'translateY(0px)';
                  }}
                  >
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#1e293b' }}>🔖 Order ID:</strong> 
                      <span style={{ 
                        marginLeft: '0.5rem', 
                        color: '#6b7280', 
                        fontSize: '0.875rem',
                        fontFamily: 'monospace'
                      }}>
                        {order._id?.slice(-8) || 'N/A'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#1e293b' }}>💰 Total:</strong> 
                      <span style={{ 
                        marginLeft: '0.5rem', 
                        color: '#059669',
                        fontWeight: '600',
                        fontSize: '1.1rem'
                      }}>
                        ${order.totalAmount || '0.00'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#1e293b' }}>📊 Status:</strong> 
                      <span style={{ 
                        marginLeft: '0.5rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: order.status === 'delivered' ? '#dcfce7' : order.status === 'shipped' ? '#dbeafe' : '#fef3c7',
                        color: order.status === 'delivered' ? '#166534' : order.status === 'shipped' ? '#1e40af' : '#92400e'
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: '#1e293b' }}>📦 Items:</strong> 
                      <span style={{ marginLeft: '0.5rem', color: '#374151' }}>
                        {order.items?.length || 0} items
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length > 3 && (
                  <p style={{ 
                    textAlign: 'center', 
                    color: '#64748b', 
                    fontStyle: 'italic',
                    marginTop: '1rem'
                  }}>
                    ...and {orders.length - 3} more orders
                  </p>
                )}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#64748b',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '2px dashed #cbd5e1'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛒</div>
                No orders found
              </div>
            )}
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