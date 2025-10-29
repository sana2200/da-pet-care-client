import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <main className="section">
      <div className="container" style={{textAlign:'center'}}>
        <h2>Page not found</h2>
        <p className="lead">The page you are looking for does not exist.</p>
        <Link className="btn btn-primary" to="/">Go Home</Link>
      </div>
    </main>
  )
}
