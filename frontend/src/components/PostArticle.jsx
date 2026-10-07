import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function PostArticle() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [err, setErr] = useState("");

  const postNewArticle = async (formData) => {
    try {
      setErr("");

      const token = await getToken();

      const res = await axios.post(
        `${API_URL}/author-api/article`,
        {
          title: formData.title,
          category: formData.category,
          content: formData.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        navigate("/author-dashboard");
      }
    } catch (error) {
      console.error("Post article error:", error);
      setErr(
        error.response?.data?.message || "Failed to publish article"
      );
    }
  };

  return (
    <div className="post-article-wrap">
      <div className="post-article-card">
        {/* Header */}
        <div className="pac-header">
          <h2>New Article</h2>
          <p>Share your knowledge with the InkSpace community</p>
        </div>

        {/* Body */}
        <div className="pac-body">
          {err && <p className="text-error" style={{ marginBottom: 16 }}>⚠ {err}</p>}

          <form onSubmit={handleSubmit(postNewArticle)}>
            {/* Title */}
            <div style={{ marginBottom: 20 }}>
              <label className="inkspace-form-label">Title</label>
              <input
                className="inkspace-input"
                placeholder="Give your article a compelling title…"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <p className="text-error">Title is required</p>
              )}
            </div>

            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <label className="inkspace-form-label">Category</label>
              <select
                className="inkspace-input inkspace-select"
                defaultValue=""
                {...register("category", { required: true })}
              >
                <option value="" disabled>
                  Select a category…
                </option>
                <option value="programming">Programming</option>
                <option value="AI&ML">AI &amp; ML</option>
                <option value="database">Database</option>
              </select>
              {errors.category && (
                <p className="text-error">Please select a category</p>
              )}
            </div>

            {/* Content */}
            <div style={{ marginBottom: 24 }}>
              <label className="inkspace-form-label">Content</label>
              <textarea
                className="inkspace-input"
                rows="12"
                placeholder="Write your article here…"
                {...register("content", { required: true })}
              />
              {errors.content && (
                <p className="text-error">Content is required</p>
              )}
            </div>

            <div style={{ textAlign: "right" }}>
              <button
                type="submit"
                className="post-article-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publishing…" : "Publish Article"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostArticle;
