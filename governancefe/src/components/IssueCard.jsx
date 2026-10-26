
import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { getIssuePhoto } from "../services/api.js";

function IssueCard({ issue }) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoError, setPhotoError] = useState(false);

  const token = localStorage.getItem("civicToken");

  const formattedDate = issue.createdAt
    ? new Date(issue.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;

    async function loadPhoto() {
      setPhotoUrl("");
      setPhotoError(false);

      // Support old demo data that stores a Base64 image.
      if (
        typeof issue.photo === "string" &&
        issue.photo.startsWith("data:image/")
      ) {
        setPhotoUrl(issue.photo);
        return;
      }

      // Backend photo endpoint requires a saved issue ID.
      if (!issue.id || !token) {
        setPhotoError(true);
        return;
      }

      try {
        const blob = await getIssuePhoto(issue.id, token);

        if (!(blob instanceof Blob) || blob.size === 0) {
          throw new Error("Photo is empty.");
        }

        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setPhotoUrl(objectUrl);
        }
      } catch (error) {
        console.error("Could not load issue photo:", error);

        if (!cancelled) {
          setPhotoError(true);
        }
      }
    }

    loadPhoto();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [issue.id, issue.photo, token]);

  const normalizedStatus = String(issue.status || "PENDING").toUpperCase();
  const isResolved = ["DONE", "RESOLVED"].includes(normalizedStatus);

  return (
    <article className="issue-card">
      {photoUrl ? (
        <img
          className="issue-card-photo"
          src={photoUrl}
          alt={issue.title || "Reported civic issue"}
          onError={() => setPhotoError(true)}
        />
      ) : photoError ? (
        <div className="issue-card-photo photo-unavailable">
          Photo unavailable
        </div>
      ) : (
        <div className="issue-card-photo photo-unavailable">
          Loading photo...
        </div>
      )}

      <div className="issue-card-content">
        <div className="issue-card-top">
          <span className="issue-category">
            {issue.category || "Civic Issue"}
          </span>

          <StatusBadge status={isResolved ? "Resolved" : "Pending"} />
        </div>

        <h3>{issue.title}</h3>

        <p className="issue-description">
          {issue.description}
        </p>

        <div className="issue-card-meta">
          <span>
            <strong>Location:</strong> {issue.location || "Not provided"}
          </span>

          <span>
            <strong>Reported:</strong> {formattedDate}
          </span>
        </div>

        {isResolved && issue.resolvedNote && (
          <p className="resolved-note">
            Resolution: {issue.resolvedNote}
          </p>
        )}
      </div>
    </article>
  );
}

export default IssueCard;

// import StatusBadge from "./StatusBadge";

// function IssueCard({ issue }) {
//   const formattedDate = issue.createdAt
//     ? new Date(issue.createdAt).toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : "Date unavailable";

//   return (
//     <article className="issue-card">
//       {issue.photo && (
//         <img
//           className="issue-card-photo"
//           src={issue.photo}
//           alt={issue.title || "Reported civic issue"}
//         />
//       )}

//       <div className="issue-card-content">
//         <div className="issue-card-top">
//           <span className="issue-category">{issue.category}</span>
//           <StatusBadge status={issue.status || "Pending"} />
//         </div>

//         <h3>{issue.title}</h3>
//         <p className="issue-description">{issue.description}</p>

//         <div className="issue-card-meta">
//           <span>
//             <strong>Location:</strong> {issue.location}
//           </span>
//           <span>
//             <strong>Reported:</strong> {formattedDate}
//           </span>
//         </div>

//         {issue.status === "Resolved" && issue.resolvedNote && (
//           <p className="resolved-note">
//             Resolution: {issue.resolvedNote}
//           </p>
//         )}
//       </div>
//     </article>
//   );
// }

// export default IssueCard;
