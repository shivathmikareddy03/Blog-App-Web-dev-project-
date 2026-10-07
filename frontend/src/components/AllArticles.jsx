import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { BsArrowRightCircle } from "react-icons/bs";
import { FcClock } from "react-icons/fc";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function AllArticles() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [articles, setArticles] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const gotoArticleView = (article) => navigate(`../${article._id}`);

  useEffect(() => {
    if (!currentUser?.email) return;

    let active = true;

    (async () => {
      try {
        setLoading(true);

        const token = await getToken();

        const res = await fetch(`${API_URL}/user-api/articles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to load articles");
        }

        if (active) {
          setArticles(data.payload);
        }
      } catch (error) {
        if (active) {
          setErr(error.message || "Unable to load articles");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [currentUser?.email, getToken]);

  if (err) {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <p className="text-error">⚠ {err}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="inkspace-loading">
        <div className="spinner-border text-secondary" role="status" />
        <p style={{ marginTop: 12 }}>Loading articles…</p>
      </div>
    );
  }

  if (!loading && articles.length === 0) {
    return (
      <div className="inkspace-empty">
        <div className="empty-icon">📭</div>
        <h5>No articles yet</h5>
        <p>Check back soon — authors are hard at work!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="section-title">Latest Articles</div>
      <p className="section-sub">{articles.length} article{articles.length !== 1 ? "s" : ""} available to read</p>

      <div className="article-grid">
        {articles.map((article) => (
          <div className="inkspace-card" key={article._id}>
            <div className="card-accent-bar" />

            <div className="card-body-inner">
              {/* Author row */}
              <div className="card-author-row">
                {article.author?.profileImageUrl && (
                  <img
                    src={article.author.profileImageUrl}
                    alt="Author"
                  />
                )}
                <span className="card-author-name">
                  {[article.author?.firstName, article.author?.lastName]
                    .filter(Boolean)
                    .join(" ") || "Anonymous"}
                </span>

                {article.category && (
                  <span className="card-category-badge">
                    {article.category}
                  </span>
                )}
              </div>

              <h5 className="card-title-text">{article.title}</h5>

              <p className="card-excerpt">
                {article.content.slice(0, 110)}
                {article.content.length > 110 ? "…" : ""}
              </p>
            </div>

            <div className="card-footer-inner">
              <span className="card-date">
                <FcClock />
                {new Date(article.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>

              <button
                className="card-read-btn"
                onClick={() => gotoArticleView(article)}
              >
                Read <BsArrowRightCircle />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllArticles;