export default function FAQ(){
  return (
    <main className="section">
      <div className="container">
        <h2>Frequently Asked Questions</h2>
        <p className="lead">Quick answers for new and experienced pet parents.</p>
        <div className="faq" style={{marginTop:16}}>
          <details>
            <summary>How often should my dog get vaccinated?</summary>
            <p>Puppies follow a series every 3–4 weeks, then yearly boosters. Your vet will personalize the plan.</p>
          </details>
          <details>
            <summary>Do you offer emergency services?</summary>
            <p>Yes, call our 24/7 helpline. We triage and prepare a room before you arrive.</p>
          </details>
          <details>
            <summary>Which food brand do you recommend?</summary>
            <p>High-protein, vet-approved formulas that match age and breed. Visit our shop page for curated options.</p>
          </details>
          <details>
            <summary>Can I stay during grooming?</summary>
            <p>Absolutely — we have a viewing area. For anxious pets, shorter sessions are available.</p>
          </details>
        </div>
      </div>
    </main>
  )
}
