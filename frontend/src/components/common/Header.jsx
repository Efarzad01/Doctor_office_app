import { useAuth } from '../../context/AuthContext'

function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary-600">
            Doctor Office Management
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="btn btn-secondary text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
