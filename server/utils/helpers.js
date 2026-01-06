// Generate a random alphanumeric string
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate order number
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${generateRandomString(6).toUpperCase()}`;
};

// Generate transaction ID
const generateTransactionId = () => {
  return `TXN-${Date.now()}-${generateRandomString(8).toUpperCase()}`;
};

// Format currency
const formatCurrency = (amount, currency = 'BDT') => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format date
const formatDate = (date, format = 'full') => {
  const options = {
    full: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' }
  };

  return new Intl.DateTimeFormat('en-US', options[format] || options.full).format(new Date(date));
};

// Pagination helper
const getPaginationData = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const totalPages = Math.ceil(total / itemsPerPage);

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems: total,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

// Calculate skip value for pagination
const getSkip = (page, limit) => {
  return (parseInt(page) - 1) * parseInt(limit);
};

// Slugify string
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Remove undefined/null values from object
const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  );
};

module.exports = {
  generateRandomString,
  generateOrderNumber,
  generateTransactionId,
  formatCurrency,
  formatDate,
  getPaginationData,
  getSkip,
  slugify,
  cleanObject
};
