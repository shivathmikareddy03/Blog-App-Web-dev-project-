import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Header() {
  const { isSignedIn, getToken } = useAuth();
  const { isLoaded } = useUser();
  const navigate = useNavigate();

  const { setCurrentUser } = useContext(UserContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !isLoaded || checked) return;

    const checkUserAndNavigate = async () => {
      try {
        const token = await getToken();

        const res = await fetch(`${API_URL}/user-api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await res.json();

        // First-time login
        if (data.firstLogin === true) {
          navigate("/role-selection");
          return;
        }

        const role = data.payload.role;

        setCurrentUser(data.payload);

        if (role === "USER") {
          navigate("/user-dashboard");
        } else {
          navigate("/author-dashboard");
        }

        setChecked(true);
      } catch (err) {
        console.error("Header auth check error:", err);
      }
    };

    checkUserAndNavigate();
  }, [
    isSignedIn,
    isLoaded,
    getToken,
    navigate,
    setCurrentUser,
    checked,
  ]);

  return (
    <nav className="inkspace-navbar">
      {/* Brand */}
      <a className="inkspace-brand" href="/">
        <div className="brand-icon">I</div>
        <span className="brand-name">
          Ink<span>Space</span>
        </span>
      </a>

      {/* Auth */}
      <div className="ms-auto">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn-signin">Sign In</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

export default Header;