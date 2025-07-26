/**
 * Resolves avatar URL for display
 * @param {string} avatarPath - The avatar path from the database
 * @param {object} supabaseClient - Supabase client instance
 * @returns {string|null} - Resolved avatar URL or null if not available
 */
export function resolveAvatarUrl(avatarPath, supabaseClient) {
  if (!avatarPath) {
    return null;
  }

  // If it's already a full URL (external image), return as-is
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }

  // Otherwise, it's a local storage path, get the public URL
  const { data } = supabaseClient
    .storage
    .from('avatars')
    .getPublicUrl(avatarPath);
  
  return data?.publicUrl || null;
} 