import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../components/firebase';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export default function Bookings() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingBooking, setUpdatingBooking] = useState(null);
  const { showSuccess, showError, showWarning } = useNotification();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?redirect=' + encodeURIComponent('/bookings') + '&reason=login-required');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      setApiLoading(true);
      setError('');
      const bookingsData = await api.users.getBookings();
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setApiLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
      return;
    }

    try {
      setUpdatingBooking(bookingId);
      await api.bookings.updateStatus(bookingId, 'cancelled');
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );

      showWarning('Appointment cancelled successfully', {
        title: 'Booking Cancelled'
      });
    } catch (err) {
      console.error('Error cancelling booking:', err);
      showError(err.message || 'Failed to cancel appointment', {
        title: 'Cancellation Failed'
      });
    } finally {
      setUpdatingBooking(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': '#22c55e',
      'pending': '#f59e0b', 
      'cancelled': '#ef4444',
      'completed': '#6366f1'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'confirmed': '✅',
      'pending': '⏳',
      'cancelled': '❌',
      'completed': '🎉'
    };
    return icons[status] || '📅';
  };

  const canCancelBooking = (booking) => {
    // Can't cancel if already cancelled or completed
    if (['cancelled', 'completed'].includes(booking.status)) {
      return false;
    }
    
    // Can't cancel if appointment is in the past
    const appointmentDateTime = new Date(`${booking.appointmentDate}T${booking.appointmentTime || '00:00'}`);
    const now = new Date();
    
    return appointmentDateTime > now;
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
          <p>Loading your appointments...</p>
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
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
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
            My Appointments
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9, 
            marginBottom: 0,
            color: 'white'
          }}>
            Manage your pet care appointments 📅
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
              onClick={loadBookings}
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

        {bookings.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📅</div>
            <h3 style={{ 
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              No Appointments Yet
            </h3>
            <p style={{ 
              color: '#64748b',
              fontSize: '1rem',
              marginBottom: '2rem',
              maxWidth: '400px',
              margin: '0 auto 2rem'
            }}>
              You haven't booked any appointments yet. Schedule your first pet care service today!
            </p>
            <Link 
              to="/book"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                marginRight: '1rem'
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
              to="/services"
              style={{
                display: 'inline-block',
                background: 'transparent',
                color: '#64748b',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.target.style.borderColor = '#06b6d4';
                e.target.style.color = '#06b6d4';
              }}
              onMouseLeave={e => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.color = '#64748b';
              }}
            >
              🏥 View Services
            </Link>
          </div>
        ) : (
          <>
            {/* Bookings Summary */}
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
                    color: '#06b6d4',
                    marginBottom: '0.25rem'
                  }}>
                    {bookings.length}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Appointments</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#22c55e',
                    marginBottom: '0.25rem'
                  }}>
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Confirmed</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#f59e0b',
                    marginBottom: '0.25rem'
                  }}>
                    {bookings.filter(b => b.status === 'pending').length}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Pending</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#6366f1',
                    marginBottom: '0.25rem'
                  }}>
                    {bookings.filter(b => b.status === 'completed').length}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Completed</div>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
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
                  📋 Appointment History
                </h3>
                <Link 
                  to="/book"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.boxShadow = '0 2px 8px rgba(6, 182, 212, 0.3)';
                  }}
                >
                  + New Appointment
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bookings
                  .sort((a, b) => new Date(`${b.appointmentDate}T${b.appointmentTime || '00:00'}`) - new Date(`${a.appointmentDate}T${a.appointmentTime || '00:00'}`))
                  .map((booking) => {
                    const appointmentDate = new Date(`${booking.appointmentDate}T${booking.appointmentTime || '00:00'}`);
                    const isPast = appointmentDate < new Date();
                    
                    return (
                      <div 
                        key={booking._id}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          transition: 'all 0.2s ease',
                          backgroundColor: '#fafafa',
                          opacity: booking.status === 'cancelled' ? 0.7 : 1
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '1rem'
                        }}>
                          {/* Appointment Info */}
                          <div style={{ flex: 1, minWidth: '300px' }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: '1rem',
                              marginBottom: '1rem'
                            }}>
                              <div style={{
                                fontSize: '2rem',
                                padding: '0.5rem',
                                backgroundColor: getStatusColor(booking.status) + '15',
                                borderRadius: '12px',
                                border: `2px solid ${getStatusColor(booking.status)}30`
                              }}>
                                🏥
                              </div>
                              <div>
                                <div style={{ 
                                  fontWeight: '700',
                                  fontSize: '1.2rem',
                                  color: '#1e293b',
                                  marginBottom: '0.25rem'
                                }}>
                                  {booking.serviceName}
                                </div>
                                <div style={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}>
                                  <span style={{ 
                                    padding: '0.25rem 0.75rem', 
                                    borderRadius: '20px', 
                                    fontSize: '0.75rem', 
                                    fontWeight: '600',
                                    backgroundColor: getStatusColor(booking.status) + '15',
                                    color: getStatusColor(booking.status),
                                    border: `1px solid ${getStatusColor(booking.status)}30`,
                                    textTransform: 'capitalize',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}>
                                    {getStatusIcon(booking.status)} {booking.status}
                                  </span>
                                  {isPast && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                    <span style={{
                                      fontSize: '0.75rem',
                                      color: '#ef4444',
                                      backgroundColor: '#fee2e2',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '12px',
                                      border: '1px solid #fecaca'
                                    }}>
                                      Past Due
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div style={{ 
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                              gap: '1rem',
                              fontSize: '0.9rem'
                            }}>
                              <div>
                                <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>📅 Date & Time</div>
                                <div style={{ color: '#1e293b', fontWeight: '600' }}>
                                  {formatDate(booking.appointmentDate)}
                                </div>
                                <div style={{ color: '#1e293b', fontWeight: '600' }}>
                                  🕐 {booking.appointmentTime ? formatTime(booking.appointmentTime) : 'Time TBD'}
                                </div>
                              </div>
                              
                              <div>
                                <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>👤 Customer</div>
                                <div style={{ color: '#1e293b', fontWeight: '600' }}>
                                  {booking.customerName}
                                </div>
                                <div style={{ color: '#64748b' }}>
                                  📱 {booking.phone}
                                </div>
                              </div>

                              {booking.petName && (
                                <div>
                                  <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>🐕 Pet Info</div>
                                  <div style={{ color: '#1e293b', fontWeight: '600' }}>
                                    {booking.petName}
                                  </div>
                                  {booking.petType && (
                                    <div style={{ color: '#64748b' }}>
                                      {booking.petType} {booking.petAge && `• ${booking.petAge}`}
                                    </div>
                                  )}
                                </div>
                              )}

                              <div>
                                <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>📅 Booked On</div>
                                <div style={{ color: '#1e293b', fontWeight: '600' }}>
                                  {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>

                            {booking.notes && (
                              <div style={{ 
                                marginTop: '1rem',
                                padding: '0.75rem',
                                backgroundColor: '#f8fafc',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0'
                              }}>
                                <div style={{ 
                                  color: '#64748b', 
                                  fontSize: '0.875rem', 
                                  marginBottom: '0.25rem' 
                                }}>
                                  📝 Notes:
                                </div>
                                <div style={{ color: '#1e293b', fontSize: '0.9rem' }}>
                                  {booking.notes}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div style={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            minWidth: '150px'
                          }}>
                            {canCancelBooking(booking) && (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                disabled={updatingBooking === booking._id}
                                style={{
                                  background: updatingBooking === booking._id 
                                    ? '#f3f4f6' 
                                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                  color: updatingBooking === booking._id ? '#6b7280' : 'white',
                                  border: 'none',
                                  padding: '0.5rem 1rem',
                                  borderRadius: '8px',
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  cursor: updatingBooking === booking._id ? 'not-allowed' : 'pointer',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem',
                                  boxShadow: updatingBooking === booking._id 
                                    ? 'none' 
                                    : '0 2px 8px rgba(239, 68, 68, 0.3)'
                                }}
                                onMouseEnter={e => {
                                  if (updatingBooking !== booking._id) {
                                    e.target.style.transform = 'translateY(-1px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                                  }
                                }}
                                onMouseLeave={e => {
                                  if (updatingBooking !== booking._id) {
                                    e.target.style.transform = 'translateY(0px)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                                  }
                                }}
                              >
                                {updatingBooking === booking._id ? (
                                  <>
                                    <div style={{
                                      width: '14px',
                                      height: '14px',
                                      border: '2px solid #d1d5db',
                                      borderTop: '2px solid #6b7280',
                                      borderRadius: '50%',
                                      animation: 'spin 1s linear infinite'
                                    }}></div>
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    ❌ Cancel
                                  </>
                                )}
                              </button>
                            )}

                            <Link
                              to={`/book?service=${encodeURIComponent(booking.serviceName)}`}
                              style={{
                                background: 'transparent',
                                color: '#06b6d4',
                                textDecoration: 'none',
                                border: '2px solid #06b6d4',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                textAlign: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={e => {
                                e.target.style.backgroundColor = '#06b6d4';
                                e.target.style.color = 'white';
                              }}
                              onMouseLeave={e => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#06b6d4';
                              }}
                            >
                              📅 Rebook
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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