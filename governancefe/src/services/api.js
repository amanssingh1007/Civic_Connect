
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Common API request function
export async function apiRequest(endpoint, options = {}, token = null) {
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle API errors
  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    let message = `Request failed: ${response.status}`;

    if (contentType.includes("application/json")) {
      const errorData = await response.json().catch(() => ({}));
      message = errorData.message || message;
    } else {
      const errorText = await response.text().catch(() => "");
      if (errorText) message = errorText;
    }

    throw new Error(message);
  }

  // Handle empty response
  if (response.status === 204) {
    return null;
  }

  // Handle photo/image response
  const contentType = response.headers.get("content-type") || "";

  if (contentType.startsWith("image/")) {
    return response.blob();
  }

  // Handle JSON response
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

// Upload an issue photo
export async function uploadIssuePhoto(issueId, file, token) {
  const formData = new FormData();
  formData.append("photo", file);

  return apiRequest(
    `/issues/${issueId}/photo`,
    {
      method: "POST",
      body: formData,
    },
    token
  );
}

// Fetch an issue photo as a Blob
export async function getIssuePhoto(issueId, token) {
  return apiRequest(`/issues/${issueId}/photo`, {}, token);
}

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// export async function apiRequest(endpoint, options = {}) {
//   const isFormData = options.body instanceof FormData;

//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       ...(isFormData ? {} : { "Content-Type": "application/json" }),
//       ...options.headers,
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(
//       errorData.message || `Request failed: ${response.status}`
//     );
//   }

//   if (response.status === 204) return null;

//   return response.json();
// }
