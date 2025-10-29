import { Link, useLocation } from 'react-router-dom'

export default function Footer(){
  const { pathname } = useLocation()
  // Simple conditional content by route, similar to original pages
  return (
    <footer className="footer">
      <div className="container grid">
        {pathname === '/' && (
          <>
            <div className="col-6">
              <h4>Pet Care Clinic</h4>
              <p>Your trusted neighborhood vet & shop.</p>
            </div>
            <div className="col-3">
              <h4>Quick Links</h4>
              <p><Link to="/services">Services</Link></p>
              <p><Link to="/shop">Shop</Link></p>
              <p><Link to="/about">About</Link></p>
            </div>
            <div className="col-3">
              <h4>Contact</h4>
              <p>📞 +880 1XXX-XXXXXX</p>
              <p>📧 contact@dapetcare.com</p>
            </div>
          </>
        )}

        {pathname === '/services' && (
          <>
            <div className="col-6"><h4>Need urgent help?</h4><p>Call our 24/7 emergency line: +880 1XXX-XXXXXX</p></div>
            <div className="col-3"><h4>Pages</h4><p><Link to="/shop">Shop</Link></p><p><Link to="/about">About</Link></p></div>
            <div className="col-3"><h4>Visit</h4><p>Road 12, Banani, Dhaka</p></div>
          </>
        )}

        {pathname === '/shop' && (
          <>
            <div className="col-6"><h4>Free pickup from clinic</h4><p>Order online, collect in 30 minutes.</p></div>
            <div className="col-3"><h4>Help</h4><p><Link to="/faq">FAQ</Link></p></div>
            <div className="col-3"><h4>Contact</h4><p>📞 +880 1XXX-XXXXXX</p></div>
          </>
        )}

        {pathname === '/about' && (
          <>
            <div className="col-6"><h4>Join our mission</h4><p>We host adoption days & workshops monthly.</p></div>
            <div className="col-3"><h4>Events</h4><p><a href="#">Next Adoption Day →</a></p></div>
            <div className="col-3"><h4>Follow</h4><p>🐦 🟦 ▶️</p></div>
          </>
        )}

        {pathname === '/faq' && (
          <>
            <div className="col-6"><h4>Still have questions?</h4><p><Link to="/contact">Send us a message →</Link></p></div>
            <div className="col-3"><h4>Resources</h4><p><Link to="/services">Care Services</Link></p></div>
            <div className="col-3"><h4>Location</h4><p>Banani, Dhaka</p></div>
          </>
        )}

        {pathname === '/contact' && (
          <>
            <div className="col-6"><h4>Phone</h4><p>📞 +880 1XXX-XXXXXX</p></div>
            <div className="col-3"><h4>Email</h4><p>hello@petcare.example</p></div>
            <div className="col-3"><h4>Hours</h4><p>Open 9am–9pm</p></div>
          </>
        )}
      </div>
      <div className="copy">© 2025 Pet Care Clinic — All rights reserved.</div>
    </footer>
  )
}
