import Header from './Header'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="inkspace-footer">
        <div className="container">
          <div className="row gy-4">
            {/* Brand col */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-brand">Ink<span>Space</span></div>
              <div className="footer-tagline">A place for stories, ideas &amp; knowledge.</div>
              <p style={{ marginTop: 14, fontSize: '0.85rem', color: '#6a6a7e', lineHeight: 1.7 }}>
                Built as a student project to explore full-stack development with React,
                Node.js, MongoDB, and Clerk authentication.
              </p>
            </div>

            {/* Links col */}
            <div className="col-lg-2 col-md-3 col-6">
              <h6>Explore</h6>
              <a href="/user-dashboard/all-articles">All Articles</a>
              <a href="/role-selection">Join as Author</a>
              <a href="/">Home</a>
            </div>

            {/* Topics col */}
            <div className="col-lg-2 col-md-3 col-6">
              <h6>Topics</h6>
              <a href="#">Programming</a>
              <a href="#">AI &amp; ML</a>
              <a href="#">Database</a>
            </div>

            {/* About col */}
            <div className="col-lg-4 col-md-12">
              <h6>About</h6>
              <p style={{ fontSize: '0.85rem', color: '#6a6a7e', lineHeight: 1.7 }}>
                InkSpace is an open blogging platform where anyone can read, and
                authors can share their insights. Sign up today and start your
                writing journey.
              </p>
            </div>
          </div>

          <hr className="footer-divider" />
          <div className="footer-copy">
            © {new Date().getFullYear()} InkSpace · Made with ♥ as a student project
          </div>
        </div>
      </footer>
    </div>
  )
}

export default RootLayout