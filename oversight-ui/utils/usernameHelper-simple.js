// utils/usernameHelper.js

/**
 * Generate a username from email - SIMPLE VERSION
 * Just use the part before @ in the email
 */
export function generateUsernameFromEmail(email) {
  if (!email) return null;

  const emailPrefix = email.split("@")[0];
  // Clean it up - only allow letters, numbers, and underscores
  return emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Get username for a user - simple version using email
 */
export function getUsername(user) {
  if (!user?.emailAddresses?.[0]?.emailAddress) {
    return null;
  }

  return generateUsernameFromEmail(user.emailAddresses[0].emailAddress);
}
