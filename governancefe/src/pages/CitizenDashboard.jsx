
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import IssueForm from "../components/IssueForm";
import IssueCard from "../components/IssueCard";
import { apiRequest, uploadIssuePhoto } from "../services/api.js";
import "../styles/CitizenDashboard.css";

function CitizenDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("civicToken");

  async function loadIssues() {
    try {
      const data = await apiRequest("/issues/my", {}, token);
      setIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not load reports: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedUser = JSON.parse(
      localStorage.getItem("civicCurrentUser") || "null"
    );

    if (
      !savedUser ||
      savedUser.role?.toUpperCase() !== "CITIZEN" ||
      !token
    ) {
      navigate("/login");
      return;
    }

    setUser(savedUser);
    loadIssues();
  }, [navigate]);

  async function handleIssueSubmit(formData) {
    setError("");
    setMessage("");

    try {
      // Step 1: Save issue details in the backend/database.
      const savedIssue = await apiRequest(
        "/issues",
        {
          method: "POST",
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            location: formData.location,
          }),
        },
        token
      );

      // Step 2: Upload photo using the REAL database ID.
      if (formData.photo) {
        await uploadIssuePhoto(savedIssue.id, formData.photo, token);
      }

      // Step 3: Reload issues from the backend.
      await loadIssues();

      setMessage(
        formData.photo
          ? "Issue and photo submitted successfully!"
          : "Issue submitted successfully!"
      );
    } catch (err) {
      setError("Submission failed: " + err.message);
      throw err;
    }
  }

  function handleLogout() {
    localStorage.removeItem("civicCurrentUser");
    localStorage.removeItem("civicToken");
    navigate("/login");
  }

  const pendingCount = issues.filter(
    (issue) => issue.status?.toUpperCase() === "PENDING"
  ).length;

  const resolvedCount = issues.filter((issue) =>
    ["DONE", "RESOLVED"].includes(issue.status?.toUpperCase())
  ).length;

  const filteredIssues =
    filter === "All"
      ? issues
      : issues.filter((issue) =>
          filter === "Pending"
            ? issue.status?.toUpperCase() === "PENDING"
            : ["DONE", "RESOLVED"].includes(issue.status?.toUpperCase())
        );

  if (!user) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="citizen-dashboard">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-brand">
          CivicConnect
        </Link>

        <div className="dashboard-user">
          <span>{user.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-eyebrow">CITIZEN PORTAL</p>
            <h1>Welcome, {user.name}</h1>
            <p>
              Report civic problems in your area and track their progress.
            </p>
          </div>
        </section>

        <section className="dashboard-stats">
          <div className="stat-card">
            <span>Total Reports</span>
            <strong>{issues.length}</strong>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>

          <div className="stat-card">
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
          </div>
        </section>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {loading && <p>Loading your reports...</p>}

        <div className="dashboard-content">
          <section className="report-section">
            <div className="section-heading">
              <div>
                <h2>My Reports</h2>
                <p>View the civic issues you have reported.</p>
              </div>
            </div>

            <div className="report-filters">
              {["All", "Pending", "Resolved"].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={
                    filter === status ? "filter-btn active" : "filter-btn"
                  }
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            {!loading && filteredIssues.length > 0 ? (
              <div className="issue-list">
                {filteredIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              !loading && (
                <div className="empty-reports">
                  <h3>No reports found</h3>
                  <p>
                    {filter === "All"
                      ? "Submit your first civic issue using the form."
                      : `You don't have any ${filter.toLowerCase()} reports yet.`}
                  </p>
                </div>
              )
            )}
          </section>

          <aside className="create-report-section">
            <div className="section-heading">
              <div>
                <h2>Report an Issue</h2>
                <p>Provide details and upload an existing photo.</p>
              </div>
            </div>

            <IssueForm onSubmit={handleIssueSubmit} />
          </aside>
        </div>
      </main>

      <footer className="dashboard-footer">
        CivicConnect — Building better communities together.
      </footer>
    </div>
  );
}

export default CitizenDashboard;
