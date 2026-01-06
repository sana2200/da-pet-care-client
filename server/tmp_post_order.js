const http = require('http');

const data = JSON.stringify({
  items: [{ id: '695bd5dc4e289023e06d91e7', quantity: 1 }],
  guestInfo: { name: 'Test Guest', email: 'guest@example.com', phone: '1234567890' },
  shippingAddress: { name: 'Test Guest', phone: '1234567890', address: '123 Test St' }
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => { console.log('RESPONSE:', body); });
});

req.on('error', (e) => { console.error('problem with request:', e && (e.stack || e.message || e)); });

req.write(data);
req.end();
