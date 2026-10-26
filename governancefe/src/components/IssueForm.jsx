
import { useState } from "react";

function IssueForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Road Damage");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handlePhotoChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setPhoto(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      setPhoto(null);
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Photo size must be less than 2 MB.");
      setPhoto(null);
      event.target.value = "";
      return;
    }

    setPhoto(file);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!photo) {
      setError("Please upload a photo of the issue.");
      return;
    }

    const issueData = {
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      photo,
    };

    try {
      setIsSubmitting(true);

      // Send the issue and original photo File to the parent.
      // The parent handles saving the issue and uploading the photo.
      await onSubmit(issueData);

      setTitle("");
      setCategory("Road Damage");
      setDescription("");
      setLocation("");
      setPhoto(null);

      event.target.reset();
    } catch (err) {
      setError(err.message || "Could not submit the issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="issue-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="issue-title">Issue Title</label>
        <input
          id="issue-title"
          type="text"
          placeholder="e.g. Large pothole on main road"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="issue-category">Category</label>
        <select
          id="issue-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          disabled={isSubmitting}
        >
          <option>Road Damage</option>
          <option>Garbage</option>
          <option>Water Leakage</option>
          <option>Street Light</option>
          <option>Drainage</option>
          <option>Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="issue-location">Location</label>
        <input
          id="issue-location"
          type="text"
          placeholder="Enter area or street name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="issue-description">Description</label>
        <textarea
          id="issue-description"
          placeholder="Describe the civic issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="issue-photo">Upload Issue Photo</label>
        <input
          id="issue-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          required
          disabled={isSubmitting}
        />

        <small>
          Choose an existing JPG, PNG, or WEBP photo.
          Maximum size: 2 MB.
        </small>

        {photo && (
          <p className="selected-photo">
            Selected: {photo.name}
          </p>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      <button
        type="submit"
        className="submit-issue-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}

export default IssueForm;

// import { useState } from "react";

// function IssueForm({ onSubmit }) {
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("Road Damage");
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState("");
//   const [photo, setPhoto] = useState(null);
//   const [error, setError] = useState("");

//   function handlePhotoChange(event) {
//     const file = event.target.files[0];

//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       setError("Please select an image file.");
//       setPhoto(null);
//       event.target.value = "";
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       setError("Photo size must be less than 2 MB.");
//       setPhoto(null);
//       event.target.value = "";
//       return;
//     }

//     setPhoto(file);
//     setError("");
//   }

//   function handleSubmit(event) {
//     event.preventDefault();
//     setError("");

//     if (!photo) {
//       setError("Please upload a photo of the issue.");
//       return;
//     }

//     const reader = new FileReader();

//     reader.onload = () => {
//       onSubmit({
//         title: title.trim(),
//         category,
//         description: description.trim(),
//         location: location.trim(),
//         photo: reader.result,
//       });

//       setTitle("");
//       setCategory("Road Damage");
//       setDescription("");
//       setLocation("");
//       setPhoto(null);

//       event.target.reset();
//     };

//     reader.onerror = () => {
//       setError("Could not read the photo. Please try again.");
//     };

//     reader.readAsDataURL(photo);
//   }

//   return (
//     <form className="issue-form" onSubmit={handleSubmit}>
//       <div className="form-group">
//         <label htmlFor="issue-title">Issue Title</label>
//         <input
//           id="issue-title"
//           type="text"
//           placeholder="e.g. Large pothole on main road"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="issue-category">Category</label>
//         <select
//           id="issue-category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           required
//         >
//           <option>Road Damage</option>
//           <option>Garbage</option>
//           <option>Water Leakage</option>
//           <option>Street Light</option>
//           <option>Drainage</option>
//           <option>Other</option>
//         </select>
//       </div>

//       <div className="form-group">
//         <label htmlFor="issue-location">Location</label>
//         <input
//           id="issue-location"
//           type="text"
//           placeholder="Enter area or street name"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="issue-description">Description</label>
//         <textarea
//           id="issue-description"
//           placeholder="Describe the civic issue..."
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           rows="4"
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="issue-photo">Upload Issue Photo</label>
//         <input
//           id="issue-photo"
//           type="file"
//           accept="image/*"
//           onChange={handlePhotoChange}
//           required
//         />
//         <small>Choose an existing photo from your device. Maximum size: 2 MB.</small>

//         {photo && (
//           <p className="selected-photo">
//             Selected: {photo.name}
//           </p>
//         )}
//       </div>

//       {error && <p className="form-error">{error}</p>}

//       <button type="submit" className="submit-issue-btn">
//         Submit Report
//       </button>
//     </form>
//   );
// }

// export default IssueForm;
