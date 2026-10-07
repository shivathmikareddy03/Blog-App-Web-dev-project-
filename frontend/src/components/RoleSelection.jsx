import { useForm } from "react-hook-form";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function RoleSelection() {
  const { getToken } = useAuth();
  const { isLoaded } = useUser();
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "",
    },
  });

  if (!isLoaded) {
    return (
      <div className="inkspace-loading">
        <div className="spinner-border text-secondary" role="status" />
        <p style={{ marginTop: 12 }}>Loading…</p>
      </div>
    );
  }

  const onSubmit = async (formData) => {
    try {
      const token = await getToken();

      const res = await fetch(`${API_URL}/user-api/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: formData.role }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Profile creation failed");
      }

      const resBody = await res.json();

      const role = resBody.payload.role;

      setCurrentUser(resBody.payload);

      if (role === "USER") {
        navigate("/user-dashboard");
      } else {
        navigate("/author-dashboard");
      }
    } catch (err) {
      console.error("Role selection error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="role-selection-wrap">
      <h2>Welcome to InkSpace!</h2>
      <p className="sub">
        How would you like to use the platform? You can always reach out to
        change this later.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Reader */}
        <label className="role-card">
          <input
            type="radio"
            value="USER"
            {...register("role", { required: "Please select a role" })}
          />
          <span className="role-icon">📚</span>
          <span className="role-info">
            <span className="role-name">Reader</span>
            <span className="role-desc">
              Browse articles, leave comments, and explore topics you love.
            </span>
          </span>
        </label>

        {/* Author */}
        <label className="role-card">
          <input
            type="radio"
            value="AUTHOR"
            {...register("role", { required: "Please select a role" })}
          />
          <span className="role-icon">✍️</span>
          <span className="role-info">
            <span className="role-name">Author</span>
            <span className="role-desc">
              Write, publish, and manage your own articles on InkSpace.
            </span>
          </span>
        </label>

        {errors.role && (
          <p className="text-error">{errors.role.message}</p>
        )}

        <button
          type="submit"
          className="role-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Setting up your account…" : "Continue →"}
        </button>
      </form>
    </div>
  );
}

export default RoleSelection;