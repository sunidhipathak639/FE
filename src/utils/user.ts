/**
 * Returns the currently logged-in user object from localStorage
 * or null if not available.
 */
export const getLoggedInUser = () => {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Failed to parse logged-in user:', error)
    return null
  }
}
