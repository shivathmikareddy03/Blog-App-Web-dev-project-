import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";

function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="inkspace-hero">
        <div className="container">
          <div className="hero-eyebrow">✦ A student blogging platform</div>

          <h1>
            Where every idea finds
            <br />
            its <em>voice.</em>
          </h1>

          <p className="hero-sub">
            InkSpace is an open platform for curious minds — read thoughtful
            articles, share your knowledge, and connect with a community of
            writers and learners.
          </p>

          <div>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="hero-cta">Get started — it&apos;s free</button>
              </SignInButton>
              <a href="#learn-more" className="hero-secondary">
                Learn more
              </a>
            </SignedOut>

            <SignedIn>
              <a href="/user-dashboard" className="hero-cta">
                Browse articles →
              </a>
            </SignedIn>
          </div>

          <div className="inkspace-features">
            <div className="feature-pill">
              <div className="pill-icon">📝</div>
              <div className="pill-label">Publish articles</div>
            </div>
            <div className="feature-pill">
              <div className="pill-icon">💬</div>
              <div className="pill-label">Leave comments</div>
            </div>
            <div className="feature-pill">
              <div className="pill-icon">🔖</div>
              <div className="pill-label">Tech &amp; AI topics</div>
            </div>
            <div className="feature-pill">
              <div className="pill-icon">🚀</div>
              <div className="pill-label">Free to use</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA section ── */}
      <section id="learn-more" className="container home-cta-section">
        <h2>Built for readers &amp; writers</h2>
        <p>
          Sign in and choose your role — explore articles as a reader, or start
          publishing as an author.
        </p>

        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <div className="home-cta-card">
            <div className="role-title">📚 Reader</div>
            <div className="role-desc" style={{ marginBottom: 0 }}>
              Browse articles across Programming, AI &amp; ML, and Databases.
              Leave comments and engage with authors.
            </div>
          </div>
          <div className="home-cta-card">
            <div className="role-title">✍️ Author</div>
            <div className="role-desc" style={{ marginBottom: 0 }}>
              Write and publish your own articles. Edit or delete your posts and
              build your writing portfolio.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;