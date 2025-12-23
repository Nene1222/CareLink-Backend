import React, { useState, useEffect } from 'react';
import './dashboard.css';

// ---- Analog Clock ----
const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour12: true });
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="clock-widget">
      <div className="clock-face">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="clock-mark" style={{ transform: `rotate(${i * 30}deg)` }} />
        ))}
        <div className="clock-hand hour-hand" style={{ transform: `rotate(${hourDeg}deg)` }} />
        <div className="clock-hand minute-hand" style={{ transform: `rotate(${minuteDeg}deg)` }} />
        <div className="clock-hand second-hand" style={{ transform: `rotate(${secondDeg}deg)` }} />
        <div className="clock-center" />
      </div>
      <div className="clock-time">{formatTime(time)}</div>
      <div className="clock-date">{formatDate(time)}</div>
    </div>
  );
};

// ---- Stats Card ----
const StatCard = ({ icon, label, value, bgColor }: any) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ backgroundColor: bgColor }}>
      {icon}
    </div>
    <div className="stat-info">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  </div>
);

// ---- Sales Chart ----
const SalesChart = () => {
  const dataPoints = [
    { x: 40, y: 120, value: '₹85K', month: 'Jan' },
    { x: 100, y: 80, value: '₹125K', month: 'Feb' },
    { x: 160, y: 95, value: '₹110K', month: 'Mar' },
    { x: 220, y: 55, value: '₹165K', month: 'Apr' },
    { x: 280, y: 70, value: '₹145K', month: 'May' },
    { x: 340, y: 35, value: '₹190K', month: 'Jun' },
  ];

  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const pathPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `40,150 ${pathPoints} 340,150`;

  return (
    <div className="sales-chart">
      <div className="chart-header">
        <div className="chart-title">
          <span className="chart-icon">📈</span>
          <div>
            <div className="chart-main-title">Sales Overview</div>
            <div className="chart-subtitle">Monthly revenue tracking</div>
          </div>
        </div>
        <div className="chart-controls">
          <select className="month-select">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
          <div className="chart-total">
            <span className="total-label">Total Revenue</span>
            <span className="total-value">₹ 10,85,356</span>
            <span className="total-change">+12.5% ↗</span>
          </div>
        </div>
      </div>
      <div className="chart-container">
        <svg viewBox="0 0 380 170" className="chart-svg">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Grid lines */}
          {[30, 60, 90, 120].map(y => (
            <line key={y} x1="30" y1={y} x2="350" y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" />
          ))}
          
          {/* Area fill */}
          <polygon points={areaPoints} fill="url(#areaGradient)" />
          
          {/* Main line */}
          <polyline
            points={pathPoints}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
          
          {/* Data points */}
          {dataPoints.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === i ? 7 : 5}
                fill="#fff"
                stroke="#6366f1"
                strokeWidth="3"
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {hoveredPoint === i && (
                <>
                  <rect
                    x={point.x - 30}
                    y={point.y - 35}
                    width="60"
                    height="25"
                    fill="#1e293b"
                    rx="6"
                  />
                  <text
                    x={point.x}
                    y={point.y - 18}
                    fontSize="12"
                    fill="#fff"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {point.value}
                  </text>
                </>
              )}
              <text
                x={point.x}
                y="165"
                fontSize="11"
                fill="#64748b"
                textAnchor="middle"
                fontWeight="500"
              >
                {point.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// ---- Calendar Widget (robust) ----

const Calendar: React.FC = () => {
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0 = Sunday

  const changeMonth = (delta: number) => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  };

  const today = new Date();
  const daysInMonth = getDaysInMonth(viewDate);
  const firstDayIndex = getFirstDayOfMonth(viewDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="calendar-widget">
      <div className="calendar-header">📅 Cambodia Holidays</div>

      <div className="calendar-nav">
        <button className="nav-btn" onClick={() => changeMonth(-1)} aria-label="Previous month">‹</button>
        <span className="calendar-month">{monthLabel}</span>
        <button className="nav-btn" onClick={() => changeMonth(1)} aria-label="Next month">›</button>
      </div>

      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="weekday">{d}</div>
        ))}
      </div>

      <div className="calendar-grid" role="grid" aria-label={`Calendar for ${monthLabel}`}>
        {/* leading empty slots */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty" />
        ))}

        {/* actual days */}
        {days.map((day) => {
          const isToday =
            day === today.getDate() &&
            viewDate.getMonth() === today.getMonth() &&
            viewDate.getFullYear() === today.getFullYear();

          return (
            <div
              key={day}
              className={`calendar-day ${isToday ? 'today' : ''}`}
              role="gridcell"
              aria-selected={isToday}
            >
              <span className="day-number">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ---- Attendance Trends ----
const AttendanceTrends = () => (
  <div className="attendance-trends">
    <div className="trends-header">
      <span className="trends-icon">👥</span>
      Attendance Trends
    </div>
    <div className="status-section">
      <div className="status-label">Current Status Overview:</div>
      <div className="status-badges">
        <div className="status-badge pending">
          <span className="badge-icon">⏳</span>
          <span>1 Pending</span>
        </div>
      </div>
    </div>
    <div className="user-list">
      <div className="user-item">
        <span className="user-label">admin</span>
        <div className="status-badge pending">
          <span className="badge-icon">⏳</span>
          <span>1 pending</span>
        </div>
      </div>

    </div>
  </div>
);

// ---- Quick Access ----
const QuickAccess = () => (
  <div className="quick-access">
    <div className="quick-header">Quick Access</div>
<div className="quick-grid">
  <div className="quick-item" style={{ backgroundColor: '#3b82f6' }}>
    <span className="quick-icon">🛒</span>
    <div className="quick-label">POS System</div>
  </div>

  <div className="quick-item" style={{ backgroundColor: '#10b981' }}>
    <span className="quick-icon">✓</span>
    <div className="quick-label">Attendance</div>
  </div>

  <div className="quick-item" style={{ backgroundColor: '#a855f7' }}>
    <span className="quick-icon">📝</span>
    <div className="quick-label">Medical record</div>
  </div>

  <div className="quick-item" style={{ backgroundColor: '#f97316' }}>
    <span className="quick-icon">💊</span>
    <div className="quick-label">Inventory</div>
  </div>
</div>

  </div>
);

// ---- Dashboard ----
const Home = () => {
  const stats = [
    { icon: '💰', label: 'Total Profit', value: '₹ 1,03,748', bgColor: '#dbeafe' },
    { icon: '📦', label: 'Inventory Stock', value: '1,432', bgColor: '#fef3c7' },
    { icon: '📉', label: 'Out of Stock', value: '389', bgColor: '#dcfce7' },
    { icon: '⚠️', label: 'Expired', value: '24', bgColor: '#fee2e2' },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here's your overview</p>
      </div>

      <div className="dashboard-content">
        {/* Stats Row */}
        <div className="stats-row">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid">
          <div className="left-column">
            <SalesChart />
            <AttendanceTrends />
          </div>
          <div className="right-column">
            <AnalogClock />
            <Calendar />
            <QuickAccess />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
