import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/dashboard';
import AttendancePage from './features/attendance/attendance';
import { AppointmentsPage } from './features/appointment/appointment'; 
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/appointment" element={<AppointmentsPage />} />
          <Route path="/profile" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
