import { NavLink, Outlet } from "react-router-dom";

function AuthorDashboard() {
  return (
    <div>
      {/* Tab nav */}
      <nav className="inkspace-dash-nav">
        <NavLink to="articles" className={({ isActive }) => isActive ? "active" : ""}>
          My Articles
        </NavLink>
        <NavLink to="article" className={({ isActive }) => isActive ? "active" : ""}>
          + New Article
        </NavLink>
      </nav>

      <div className="container" style={{ paddingTop: 32 }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthorDashboard;
