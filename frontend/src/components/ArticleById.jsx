import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@clerk/clerk-react";
import { UserContext } from "../contexts/userContext";
import {
  FcClock,
  FcCalendar,
  FcComments,
  FcPortraitMode,
} from "react-icons/fc";
import { BiCommentAdd } from "react-icons/bi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function ArticleById() {
  const { articleId } = useParams();
  const { getToken } = useAuth();
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const [commentStatus, setCommentStatus] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({
    title: "",
    category: "",
    content: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const token = await getToken();

        const res = await fetch(
          `${API_URL}/user-api/articles/${articleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to load article");
        }

        if (active) {
          setArticle(data.payload);
        }
      } catch (e) {
        if (active) {
          setError(e.message || "Unable to load article");
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [articleId, getToken]);

  const addComment = async ({ comment }) => {
    try {
      const token = await getToken();

      const res = await fetch(`${API_URL}/user-api/comment/${articleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add comment");
      }

      setArticle((previous) => ({
        ...previous,
        comments: data.payload.comments,
      }));

      setCommentStatus("Comment added successfully!");
      reset();
    } catch (e) {
      setCommentStatus(e.message || "Failed to add comment");
    }
  };

  const saveArticle = async (event) => {
    event.preventDefault();

    try {
      const token = await getToken();

      const res = await fetch(
        `${API_URL}/author-api/articles/${articleId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFields),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not update article");
      }

      setArticle((previous) => ({
        ...previous,
        ...data.payload,
      }));

      setEditMode(false);
      setCommentStatus("Article updated successfully!");
    } catch (e) {
      setCommentStatus(e.message || "Could not update article");
    }
  };

  const deleteArticle = async () => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      const token = await getToken();

      const res = await fetch(
        `${API_URL}/author-api/articles/${articleId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not delete article");
      }

      navigate("/author-dashboard/articles");
    } catch (e) {
      setCommentStatus(e.message || "Could not delete article");
    }
  };

  if (error) {
    return (
      <div className="article-detail-wrap">
        <p className="text-error">⚠ {error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="inkspace-loading">
        <div className="spinner-border text-secondary" role="status" />
        <p style={{ marginTop: 12 }}>Loading article…</p>
      </div>
    );
  }

  const isAuthor =
    currentUser?.role === "AUTHOR" &&
    String(article.author?._id) === String(currentUser?._id);

  return (
    <article className="article-detail-wrap">
      {editMode ? (
        /* ── Edit mode ── */
        <div className="edit-form-card">
          <h4 style={{ fontFamily: "Playfair Display, serif", marginBottom: 20 }}>
            Edit Article
          </h4>

          <form onSubmit={saveArticle}>
            <div style={{ marginBottom: 18 }}>
              <label className="inkspace-form-label">Title</label>
              <input
                className="inkspace-input"
                required
                value={editFields.title}
                onChange={(e) =>
                  setEditFields({ ...editFields, title: e.target.value })
                }
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label className="inkspace-form-label">Category</label>
              <input
                className="inkspace-input"
                required
                value={editFields.category}
                onChange={(e) =>
                  setEditFields({ ...editFields, category: e.target.value })
                }
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label className="inkspace-form-label">Content</label>
              <textarea
                className="inkspace-input"
                rows="12"
                required
                value={editFields.content}
                onChange={(e) =>
                  setEditFields({ ...editFields, content: e.target.value })
                }
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="post-article-btn">
                Save changes
              </button>
              <button
                type="button"
                className="btn-edit"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <h1>{article.title}</h1>

          <div className="article-meta">
            <span className="meta-item">
              <FcCalendar />
              Created {new Date(article.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="meta-item">
              <FcClock />
              Updated {new Date(article.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            {article.category && (
              <span className="card-category-badge">{article.category}</span>
            )}
          </div>

          <div className="article-body">
            {article.content}
          </div>

          {isAuthor && (
            <div className="article-action-bar">
              <button
                className="btn-edit"
                onClick={() => {
                  setEditFields({
                    title: article.title,
                    category: article.category,
                    content: article.content,
                  });
                  setEditMode(true);
                }}
              >
                ✏ Edit article
              </button>

              <button className="btn-delete" onClick={deleteArticle}>
                🗑 Delete article
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Comments ── */}
      <section className="comments-section">
        <h4>💬 Comments</h4>

        {article.comments?.length ? (
          article.comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-author">
                <FcPortraitMode />{" "}
                {comment.user?.firstName || "Reader"}
              </div>
              <div className="comment-text">
                <FcComments style={{ marginRight: 6 }} />
                {comment.comment}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#9a9aaa", fontSize: "0.9rem" }}>
            No comments yet — be the first!
          </p>
        )}

        {commentStatus && (
          <p className="status-msg" style={{ marginTop: 12 }}>
            {commentStatus}
          </p>
        )}

        {currentUser?.role === "USER" && (
          <form
            onSubmit={handleSubmit(addComment)}
            className="comment-form"
            style={{ marginTop: 20 }}
          >
            <textarea
              {...register("comment", { required: true })}
              placeholder="Share your thoughts…"
            />

            <button className="btn-comment" disabled={isSubmitting}>
              {isSubmitting ? "Posting…" : <>Post comment <BiCommentAdd /></>}
            </button>
          </form>
        )}
      </section>
    </article>
  );
}

export default ArticleById;