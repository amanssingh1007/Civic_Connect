
function StatusBadge({ status }) {
  const resolved = status === "Resolved";

  return (
    <span
      className={`status-badge ${
        resolved ? "status-resolved" : "status-pending"
      }`}
    >
      <span className="status-dot" />
      {status}
    </span>
  );
}

export default StatusBadge;
