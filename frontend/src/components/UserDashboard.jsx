import { Link, Outlet } from "react-router-dom";

function UserDashboard() {
  return (
    <div>
      {/* Tab nav */}
      <nav className="inkspace-dash-nav">
        <Link to="all-articles">Browse Articles</Link>
      </nav>

      <div className="container" style={{ paddingTop: 32 }}>
        <Outlet />
      </div>
    </div>
  );
}

export default UserDashboard;
