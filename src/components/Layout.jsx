import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '📊', adminOnly: false },
  { to: '/drivers', label: 'المناديب', icon: '🏍️', adminOnly: false },
  { to: '/vehicles', label: 'السيارات', icon: '🚗', adminOnly: false },
  { to: '/contracts', label: 'العقود', icon: '📄', adminOnly: true },
  { to: '/violations', label: 'المخالفات', icon: '⚠️', adminOnly: false },
  { to: '/reports', label: 'التقارير', icon: '📈', adminOnly: false },
  { to: '/settings', label: 'الإعدادات', icon: '⚙️', adminOnly: true },
]

export default function Layout() {
  const { profile, isAdmin, signOut } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">صقور الغد</div>
        <nav>
          {NAV_ITEMS.filter(item => !item.adminOnly || isAdmin).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-col">
        <header className="topbar">
          <div className="topbar-user">
            <span className="role-badge">{isAdmin ? 'مدير' : 'موظف'}</span>
            <span>{profile?.full_name || ''}</span>
          </div>
          <button className="signout-btn" onClick={signOut}>تسجيل الخروج</button>
        </header>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
