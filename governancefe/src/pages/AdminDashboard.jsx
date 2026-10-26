import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import IssueCard from "../components/IssueCard";
import { apiRequest } from "../services/api.js";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("civicToken");

  const loadIssues = useCallback(async () => {
    try {
      setError("");

      const data = await apiRequest(
        "/admin/issues",
        {},
        localStorage.getItem("civicToken")
      );

      setIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not load reports: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("civicCurrentUser") || "null"
      );

      if (
        !currentUser ||
        currentUser.role?.toUpperCase() !== "ADMIN" ||
        !token
      ) {
        navigate("/admin/login", { replace: true });
        return;
      }

      loadIssues();
    } catch {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate, token, loadIssues]);

  async function handleMarkDone(issueId) {
    try {
      setError("");
      setUpdatingId(issueId);

      await apiRequest(
        `/admin/issues/${issueId}/done`,
        { method: "PATCH" },
        token
      );

      await loadIssues();
    } catch (err) {
      setError("Could not update issue: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem("civicCurrentUser");
    localStorage.removeItem("civicToken");
    navigate("/admin/login", { replace: true });
  }

  const pendingCount = issues.filter(
    (issue) => issue.status?.toUpperCase() === "PENDING"
  ).length;

  const resolvedCount = issues.filter(
    (issue) =>
      ["DONE", "RESOLVED"].includes(issue.status?.toUpperCase())
  ).length;

  const filteredIssues =
    filter === "ALL"
      ? issues
      : issues.filter(
          (issue) => issue.status?.toUpperCase() === filter
        );

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <Link to="/" className="admin-brand">
          CivicConnect <span>Admin</span>
        </Link>

        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="admin-main">
        <section className="admin-welcome">
          <p className="admin-eyebrow">ADMINISTRATION</p>
          <h1>Issue Management</h1>
          <p>
            Review reported civic issues and update their status.
          </p>
        </section>

        <section className="admin-stats">
          <div className="admin-stat-card">
            <span>Total reports</span>
            <strong>{issues.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
          </div>
        </section>

        <section className="admin-reports">
          <div className="admin-section-heading">
            <div>
              <h2>Citizen Reports</h2>
              <p>Review submitted details and attached photos.</p>
            </div>

            <select
              aria-label="Filter reports by status"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All reports</option>
              <option value="PENDING">Pending</option>
              <option value="DONE">Resolved</option>
            </select>
          </div>

          {error && <p className="admin-error">{error}</p>}

          {loading ? (
            <div className="admin-empty">
              <p>Loading citizen reports...</p>
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="admin-empty">
              <h3>No reports found</h3>
              <p>Reports matching this filter will appear here.</p>
            </div>
          ) : (
            <div className="admin-issue-list">
              {filteredIssues.map((issue) => {
                const isDone = ["DONE", "RESOLVED"].includes(
                  issue.status?.toUpperCase()
                );

                return (
                  <div className="admin-issue-row" key={issue.id}>
                    <IssueCard issue={issue} />

                    <div className="admin-issue-actions">
                      <span>
                        Reported by: {issue.citizenName || "Citizen"}
                      </span>

                      {issue.citizenEmail && (
                        <span>{issue.citizenEmail}</span>
                      )}

                      <span>
                        Status: {isDone ? "Resolved" : "Pending"}
                      </span>

                      <button
                        type="button"
                        disabled={isDone || updatingId === issue.id}
                        onClick={() => handleMarkDone(issue.id)}
                      >
                        {updatingId === issue.id
                          ? "Updating..."
                          : isDone
                            ? "Resolved"
                            : "Mark as Done"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;