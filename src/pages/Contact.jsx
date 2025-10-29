export default function Contact(){
  return (
    <main className="section">
      <div className="container">
        <h2>Contact Us</h2>
        <p className="lead">We love hearing from pet parents. Book, ask, or just say hi!</p>

        <form className="form" onSubmit={(e)=>e.preventDefault()}>
          <div className="row">
            <div>
              <label>Name</label>
              <input className="input" type="text" placeholder="Your Name" required />
            </div>
            <div>
              <label>Email</label>
              <input className="input" type="email" placeholder="Your Email" required />
            </div>
          </div>
          <div style={{marginTop:12}}>
            <label>Message</label>
            <textarea className="input" placeholder="Tell us about your pet or request an appointment..." required />
          </div>
          <div style={{marginTop:12}}>
            <button className="btn btn-primary" type="submit">Send Message</button>
          </div>
        </form>

        <div className="section" style={{paddingTop:24}}>
          <h2>Find Us</h2>
          <p className="lead">Road 12, Banani, Dhaka — Open 9am–9pm</p>
          <div className="card" style={{overflow:'hidden'}}>
            <div className="body">
              <div style={{display:'grid', placeItems:'center', height:180, background:'#eef2ff'}}>
                <span style={{fontSize:64}}>📍🗺️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
