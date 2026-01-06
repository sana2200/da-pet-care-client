import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info', // success, error, warning, info
      duration: 5000, // auto-remove after 5 seconds
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: 8000, // Error messages stay longer
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  const getNotificationStyle = (type) => {
    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      fontSize: '0.95rem',
      fontWeight: '500',
      border: '1px solid',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      transform: 'translateX(0)',
      opacity: 1,
      minWidth: '300px',
      maxWidth: '500px'
    };

    const styles = {
      success: {
        ...baseStyle,
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0',
        color: '#166534'
      },
      error: {
        ...baseStyle,
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
        color: '#dc2626'
      },
      warning: {
        ...baseStyle,
        backgroundColor: '#fffbeb',
        borderColor: '#fed7aa',
        color: '#d97706'
      },
      info: {
        ...baseStyle,
        backgroundColor: '#eff6ff',
        borderColor: '#bfdbfe',
        color: '#2563eb'
      }
    };

    return styles[type] || styles.info;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  };

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={getNotificationStyle(notification.type)}
          onClick={() => removeNotification(notification.id)}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>
            {getNotificationIcon(notification.type)}
          </span>
          <div style={{ flex: 1 }}>
            {notification.title && (
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                {notification.title}
              </div>
            )}
            <div>{notification.message}</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              opacity: 0.6,
              padding: '0.25rem',
              borderRadius: '4px',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = 1}
            onMouseLeave={(e) => e.target.style.opacity = 0.6}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}