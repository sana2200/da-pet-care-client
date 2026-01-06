import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../components/firebase'
import { useNotification } from '../context/NotificationContext'
import { useNavigate } from 'react-router-dom'
import drAnawar from '../Images/DrAnawarHossain.jpg'

export default function About(){
  const [user] = useAuthState(auth)
  const { showSuccess, showError } = useNotification()
  const navigate = useNavigate()
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewerName, setReviewerName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (!reviewText.trim()) {
      showError('Please write a review before submitting', { title: 'Review Required' })
      return
    }

    try {
      setLoading(true)
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showSuccess('Thank you for your review! 🌟', {
        title: 'Review Submitted',
        duration: 5000
      })
      
      // Reset form
      setReviewText('')
      setReviewerName('')
      setRating(5)
      setShowReviewForm(false)
    } catch (error) {
      showError('Failed to submit review. Please try again.', {
        title: 'Submission Failed'
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="section">
      <div className="container">
        <h2 className="about-title">
          <span className="about-title-icon">🐾</span>
          Our Story
          <span className="about-title-icon">💖</span>
        </h2>
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
          <h2 className="about-subtitle">
            <span className="about-subtitle-icon">👨‍⚕️</span>
            Our Vets
          </h2>
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
          <h2 className="about-subtitle">
            <span className="about-subtitle-icon">✨</span>
            Our Values
          </h2>
          <div className="kpis" style={{marginTop:12}}>
            <div className="kpi"><h3>Kindness</h3><p>Fear-free handling</p></div>
            <div className="kpi"><h3>Clarity</h3><p>Honest advice</p></div>
            <div className="kpi"><h3>Quality</h3><p>Modern care</p></div>
            <div className="kpi"><h3>Community</h3><p>Local love</p></div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="section" style={{paddingTop:24}}>
          <h2 className="about-subtitle">
            <span className="about-subtitle-icon">⭐</span>
            Customer Reviews
          </h2>
          <p className="lead">Share your experience with our pet care services</p>

          <div style={{marginTop:20, display:'flex', justifyContent:'center'}}>
            {!showReviewForm ? (
              <button 
                onClick={() => setShowReviewForm(true)}
                className="btn btn-primary"
                style={{padding:'12px 24px', fontSize:'16px'}}
              >
                ✍️ Write a Review
              </button>
            ) : (
              <div className="review-form-container">
                <form onSubmit={handleSubmitReview} className="review-form">
                  <h3 style={{marginBottom:16, fontSize:'1.4rem', textAlign:'center'}}>Share Your Experience</h3>
                  
                  {/* Star Rating */}
                  <div style={{marginBottom:16}}>
                    <label style={{display:'block', marginBottom:8, fontWeight:600}}>Your Rating</label>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`star-btn ${star <= rating ? 'active' : ''}`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div style={{marginBottom:16}}>
                    <label htmlFor="reviewerName" style={{display:'block', marginBottom:8, fontWeight:600}}>
                      Your Name
                    </label>
                    <input
                      id="reviewerName"
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Enter your name (optional)"
                      className="input"
                    />
                  </div>

                  {/* Review Text */}
                  <div style={{marginBottom:16}}>
                    <label htmlFor="reviewText" style={{display:'block', marginBottom:8, fontWeight:600}}>
                      Your Review *
                    </label>
                    <textarea
                      id="reviewText"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Tell us about your experience..."
                      className="input"
                      rows={5}
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div style={{display:'flex', gap:12, justifyContent:'center'}}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false)
                        setReviewText('')
                        setReviewerName('')
                        setRating(5)
                      }}
                      className="btn btn-outline"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sample Reviews Display */}
          <div className="testi" style={{marginTop:32}}>
            <div className="quote">
              <p>"Excellent service! Dr. Anawar was very gentle with my cat. Highly recommend!"</p>
              <div className="who">— Sarah Ahmed</div>
              <div style={{color:'#fbbf24', marginTop:4}}>⭐⭐⭐⭐⭐</div>
            </div>
            <div className="quote">
              <p>"Great grooming service. My dog looks amazing and the staff is so friendly."</p>
              <div className="who">— Rajib Khan</div>
              <div style={{color:'#fbbf24', marginTop:4}}>⭐⭐⭐⭐⭐</div>
            </div>
            <div className="quote">
              <p>"Professional and caring. They took great care of my pet during surgery."</p>
              <div className="who">— Fatima Islam</div>
              <div style={{color:'#fbbf24', marginTop:4}}>⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
