import drAnawar from '../images/DrAnawarHossain.jpg'

export default function About(){
  return (
    <main className="section">
      <div className="container">
        <h2>Our Story 🐾</h2>
        <p className="lead">Started in 2022 with a mission to make quality pet care accessible and kind 🐶💖.</p>

        <div className="grid" style={{marginTop:16}}>
          <div className="card col-6">
            <div style={{display:'grid', placeItems:'center', height:180, background:'#f0f9ff'}}>
              <span style={{fontSize:64}}>👩‍⚕️👨‍⚕️🐾</span>
            </div>
            <div className="body"><h3 className="title">A Clinic Built on Love 💙</h3><p className="meta">We believe every pet deserves gentle hands ✋, clear guidance 🧭, and joyful moments 😺.</p></div>
          </div>
          <div className="card col-6">
            <div style={{display:'grid', placeItems:'center', height:180, background:'#fff7ed'}}>
              <span style={{fontSize:64}}>🏥🧪✂️🛍️</span>
            </div>
            <div className="body"><h3 className="title">Modern Facilities 🏥</h3><p className="meta">In-house lab 🧪, surgery room 🛠️, clean grooming bay ✂️, and a curated retail corner 🛍️.</p></div>
          </div>
        </div>

        <div className="section" style={{paddingTop:28}}>
          <h2>Our Vets</h2>
          <div style={{marginTop:12, display:'flex', justifyContent:'center'}}>
            <article className="card" style={{maxWidth:860, width:'100%'}}>
              <div className="body">
                <div style={{display:'grid', gridTemplateColumns:'180px 1fr', gap:16, alignItems:'center'}}>
                  <img src={drAnawar} alt="Dr. Anawar Hossain" style={{width:180, height:180, objectFit:'cover', borderRadius:8}} />
                  <div>
                    <h3 className="title" style={{marginBottom:4}}>Dr. Anawar Hossain</h3>
                    <p className="meta">Veterinarian</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div className="section" style={{paddingTop:24}}>
          <h2>Values</h2>
          <div className="kpis" style={{marginTop:12}}>
            <div className="kpi"><h3>Kindness</h3><p>Fear-free handling</p></div>
            <div className="kpi"><h3>Clarity</h3><p>Honest advice</p></div>
            <div className="kpi"><h3>Quality</h3><p>Modern care</p></div>
            <div className="kpi"><h3>Community</h3><p>Local love</p></div>
          </div>
        </div>
      </div>
    </main>
  )
}
