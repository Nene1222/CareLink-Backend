import React, { useEffect, useState } from 'react';
import {
  Home,
  ClipboardList,
  Calendar as CalendarIcon,
  Settings,
  LogOut,
  UserCheck2,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MenuSideBar: React.FC = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname || '/dashboard');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/attendance', label: 'Attendance', icon: UserCheck2 },
    { path: '/appointment', label: 'Appointment', icon: CalendarIcon },
    { path: '/medical-record', label: 'Medical Record', icon: ClipboardList },
    { path: '/inventory', label: 'Inventory Management', icon: Settings },
  ];

  return (
    <aside
      className={`sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img
              src="/images/CareLink-Logo.png"
              alt="CareLink Logo"
              className="object-contain"
              style={{ width: 72, height: 72, display: 'block' }}
            />
          </div>
          {isExpanded && <span className="logo-text">CareLink</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              {/* Icon */}
              <div className="sidebar-icon-wrap">
                <IconComponent className="sidebar-icon" size={20} />
              </div>

              {/* Label (only visible when expanded) */}
              {isExpanded && <span className="sidebar-label">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item logout" title="Logout">
          <LogOut className="sidebar-icon" size={20} />
          {isExpanded && <span className="sidebar-label">Logout</span>}
        </button>
      </div>

      <style>{`
        /* Container */
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 80px;
          height: 100vh;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          display: flex;
          flex-direction: column;
          padding: 20px 8px;
          z-index: 100;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
          border-right: 1px solid rgba(148, 163, 184, 0.06);
          transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .sidebar.expanded {
          width: 240px;
        }

        /* Header / Logo */
        .sidebar-header {
          padding: 0 12px 18px;
          margin-bottom: 8px;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* ensure no decorative pseudo elements behind logo */
        .logo-icon::before,
        .logo-icon::after {
          content: none !important;
        }

        .logo-text {
          color: white;
          font-weight: 700;
          font-size: 18px;
          white-space: nowrap;
          opacity: 0;
          transform: translateX(-6px);
          animation: fadeIn 0.18s ease-in-out forwards;
          animation-delay: 0.06s;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Nav */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          padding: 8px 6px;
          align-items: stretch;
        }

        /* Item layout:
           we create a consistent left column for the left indicator,
           then icon column, then label column so everything lines up */
        .sidebar-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          color: rgba(226,232,240,0.75);
          background: transparent;
          text-decoration: none;
          cursor: pointer;
          transition: background .16s, color .16s, transform .12s;
          font-size: 15px;
          font-weight: 600;
          justify-content: flex-start;
          width: 100%;
          box-sizing: border-box;
        }

        /* Keep icons in a fixed column so labels align */
        .sidebar-icon-wrap {
          width: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-icon {
          color: inherit;
          transition: transform .12s ease;
        }

        .sidebar-item:hover {
          background: rgba(148,163,184,0.08);
          color: #fff;
          transform: translateX(2px);
        }

        /* active state: move indicator to left and make a subtle bg */
        .sidebar-item.active {
          background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.10));
          color: #fff;
        }

        /* left indicator (vertical bar) — placed at the left edge of the sidebar item */
        .sidebar-item.active::before {
          content: '';
          position: absolute;
          left: 6px; /* small inset from the sidebar inner edge */
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 36px;
          background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(59,130,246,0.35);
        }

        /* when collapsed (narrow), center icons vertically and hide labels */
        .sidebar:not(.expanded) .sidebar-label,
        .sidebar:not(.expanded) .logo-text {
          display: none;
        }

        /* spacing for label when expanded */
        .sidebar-label {
          white-space: nowrap;
          color: inherit;
        }

        .active-indicator { display: none; } /* removed right-side dot; we use left bar */

        /* Footer */
        .sidebar-footer {
          padding: 10px 8px 6px;
          border-top: 1px solid rgba(148,163,184,0.04);
        }

        .sidebar-item.logout {
          color: rgba(239,68,68,0.85);
        }

        .sidebar-item.logout:hover {
          background: rgba(239,68,68,0.06);
          color: #ef4444;
        }

        /* Small screens */
        @media (max-width: 768px) {
          .sidebar { width: 70px; padding: 14px 6px; }
          .sidebar.expanded { width: 200px; }
          .logo-text { font-size: 16px; }
          .sidebar-icon-wrap { width: 28px; }
        }
      `}</style>
    </aside>
  );
};

export default MenuSideBar;
