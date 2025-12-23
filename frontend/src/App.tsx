import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './components/Auth';
import Home from './pages/dashboard';
import AttendancePage from './features/attendance/attendance';
import POS from './pages/pos/POS';
import { AppointmentsPage } from './features/appointment/appointment';
import InventoryPage from './pages/inventory/page';
import MedicalRecord from './pages/medical/page';
import CompleteMedicalRecord from './pages/medical/completeMedicalRecord';
import Profile from './pages/profile';
import { AuthProvider } from './context/AuthContext';

// Wrapper component to provide navigation prop to MedicalRecord
const MedicalRecordWithNav: React.FC = () => {
  const navigate = useNavigate();
  return <MedicalRecord onNavigateToForm={() => navigate('/medical-record/complete')} />;
};

// Wrapper to provide an onBack handler to CompleteMedicalRecord
const CompleteMedicalRecordWithNav: React.FC = () => {
  const navigate = useNavigate();
  return <CompleteMedicalRecord onBack={() => navigate(-1)} />;
};

// Protected routes wrapper
const ProtectedRoutes: React.FC = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/appointment" element={<AppointmentsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/POS" element={<POS />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route
            path="/medical-record"
            element={<MedicalRecordWithNav />}
          />
          <Route path="/medical-record/complete" element={<CompleteMedicalRecordWithNav />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public auth route */}
          <Route path="/auth" element={<Auth />} />

          {/* Protected routes */}
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
