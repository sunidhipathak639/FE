import DashboardLayout from '../layouts/DashboardLayout'
import { getUserFromToken } from '../utils/token'

export default function Dashboard() {
  const user = getUserFromToken()

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Welcome to the Dashboard</h2>
        {user ? (
          <p className="text-gray-700 text-lg">
            Hello <span className="font-semibold">{user.name || 'User'}</span>! You are logged in as{' '}
            <span className="font-semibold">{user.role}</span>.
          </p>
        ) : (
          <p className="text-red-500">User information not found. Please log in again.</p>
        )}
      </div>
    </DashboardLayout>
  )
}
