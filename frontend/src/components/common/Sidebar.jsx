import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    { name: 'Dashboard', path: '/', icon: '📊', roles: ['admin', 'doctor', 'receptionist'] },
    { name: 'Patients', path: '/patients', icon: '👥', roles: ['admin', 'doctor', 'receptionist'] },
    { name: 'Doctors', path: '/doctors', icon: '👨‍⚕️', roles: ['admin', 'receptionist'] },
    { name: 'Appointments', path: '/appointments', icon: '📅', roles: ['admin', 'doctor', 'receptionist'] },
    { name: 'Medical Records', path: '/medical-records', icon: '📋', roles: ['admin', 'doctor'] },
    { name: 'Billing', path: '/billing', icon: '💰', roles: ['admin', 'receptionist'] },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const canAccess = (roles) => {
    return roles.includes(user?.role)
  }

  return (
    <aside className="bg-white w-64 min-h-screen shadow-md fixed left-0 top-16 bottom-0 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            canAccess(item.roles) && (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
