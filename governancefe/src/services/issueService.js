
const STORAGE_KEY = "civicIssues";

export function getIssues() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getIssuesByCitizen(userId) {
  return getIssues().filter(
    (issue) => String(issue.citizenId) === String(userId)
  );
}

export function saveIssue(issue) {
  const issues = getIssues();
  issues.unshift(issue);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));

  return issue;
}


export function updateIssueStatus(issueId, status) {
  const issues = getIssues();

  const updatedIssues = issues.map((issue) =>
    String(issue.id) === String(issueId)
      ? { ...issue, status }
      : issue
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIssues));

  return updatedIssues.find(
    (issue) => String(issue.id) === String(issueId)
  );
}
