import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, LayoutDashboard, ClipboardList, Calendar, User, HomeIcon, CameraIcon } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const current = location.pathname

  const tabs = [
    { path: '/dashboard', label: 'Home', icon: HomeIcon },
    { path: '/attendance?mode=scan', label: 'Scan QR', icon: CameraIcon }, // changed route
    { path: '/profile', label: 'Profile', icon: User },
    // { path: '/attendance', label: 'Attendance', icon: ClipboardList },
    // { path: '/appointment', label: 'Appointment', icon: Calendar },
  ]

  return (
    <header className="topbar">
      <div className="topbar-content">
        {/* Left - Logo */}
        {/* <div className="topbar-left">
          <Link to="/dashboard" className="brand-link">
            <div className="brand-icon">📋</div>
            <span className="brand-text">CareLink</span>
          </Link>
        </div> */}

        {/* Center - Navigation */}
        <nav className="topbar-center">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = current === tab.path
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`nav-tab ${isActive ? 'active' : ''}`}
                title={tab.label}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{tab.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right - Actions */}
        <div className="topbar-right">
          <button className="action-btn" aria-label="Notifications">
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>

          <Link to="/profile" className="user-profile">
            <div className="avatar">JD</div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar