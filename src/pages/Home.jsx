import { Link } from 'react-router-dom'
import cat from '../Images/cat.jpg'

export default function Home(){
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-wrap">
          <div>
            <span className="badge">Open 7 days · Vet & Grooming</span>
            <h1>Because Your Pet Deserves<br/> the <span style={{color:'var(--brand)'}}>Best Care</span> 🐶🐱</h1>
            <p>Modern treatment, kind hands, and quality products — all in one place.</p>
            <div className="actions">
            <Link className="btn btn-primary" to="/book">Book Appointment</Link>
              <Link className="btn btn-outline" to="/shop">Shop Toys & Food</Link>
            </div>
          </div>
          <figure className="hero-figure">
            <Link to="/">
              <img src={cat} alt="pet cat" style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}} />
            </Link>
          </figure>
        </div>
      </section>

      {/* Two medium option cards */}
      <section className="section">
        <div className="container">
          <div className="grid mt-12">
            <Link to="/services" className="col-6" style={{textDecoration:'none'}}>
              <article className="card" style={{height:'100%'}}>
                <div className="card-hero-emoji" style={{display:'grid', placeItems:'center', height:180, background:'#ecfeff'}}>
                  <span style={{fontSize:72}}>🩺</span>
                </div>
                <div className="body">
                  <div className="icon">🩺</div>
                  <h3 className="title">Services</h3>
                  <p className="meta">Vet care, grooming, diagnostics and more. Book an appointment.</p>
                  <div className="actions mt-8">
                    <span className="btn btn-primary">Explore Services</span>
                  </div>
                </div>
              </article>
            </Link>

            <Link to="/shop" className="col-6" style={{textDecoration:'none'}}>
              <article className="card" style={{height:'100%'}}>
                <div className="card-hero-emoji" style={{display:'grid', placeItems:'center', height:180, background:'#fff7ed'}}>
                  <span style={{fontSize:72}}>🛍️</span>
                </div>
                <div className="body">
                  <div className="icon">🛍️</div>
                  <h3 className="title">Shop</h3>
                  <p className="meta">Curated toys, food, treats and accessories for cats and dogs.</p>
                  <div className="actions mt-8">
                    <span className="btn btn-outline">Browse Shop</span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
