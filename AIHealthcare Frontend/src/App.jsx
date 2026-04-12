import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import DashboardPage from './dashboard/DashboardPage';
import UploadPrescriptionPage from './prescription/UploadPrescriptionPage';
import PrescriptionHistoryPage from './prescription/PrescriptionHistoryPage';
import ChatAssistantPage from './chat/ChatAssistantPage';
import SearchPrescriptionsPage from './search/SearchPrescriptionsPage';
import DietPlanGeneratorPage from './pages/DietPlanGeneratorPage';
import HealthAlertsPage from './pages/HealthAlertsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/prescriptions/upload" element={<UploadPrescriptionPage />} />
          <Route path="/prescriptions/history" element={<PrescriptionHistoryPage />} />
          <Route path="/chat" element={<ChatAssistantPage />} />
          <Route path="/search" element={<SearchPrescriptionsPage />} />
          <Route path="/diet-plan" element={<DietPlanGeneratorPage />} />
          <Route path="/health-alerts" element={<HealthAlertsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
