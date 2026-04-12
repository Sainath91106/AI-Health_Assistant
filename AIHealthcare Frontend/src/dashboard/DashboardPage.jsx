import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatsCard from '../components/StatsCard';
import AlertCard from '../components/AlertCard';
import HealthBadge from '../components/HealthBadge';
import Loader from '../components/Loader';
import RecentPrescriptionsList from '../components/dashboard/RecentPrescriptionsList';
import useAuth from '../hooks/useAuth';
import { getUserPrescriptions } from '../services/prescriptionService';
import { getDashboardStats } from '../services/dashboardService';
import { getSmartAlerts } from '../services/alertService';
import { extractErrorMessage, parseStructuredData } from '../utils/helpers';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError('');
      try {
        if (!user?._id) return;
        const [statsRes, prescriptionsRes, alertsRes] = await Promise.all([
          getDashboardStats(),
          getUserPrescriptions(user._id),
          getSmartAlerts(),
        ]);
        
        if (active) {
          setDashboardData(statsRes);
          setPrescriptions(prescriptionsRes.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
          setAlerts(Array.isArray(alertsRes) ? alertsRes : []);
        }
      } catch (err) {
        if (active) {
          const message = extractErrorMessage(err, 'Failed to load dashboard data');
          setError(message);
          toast.error(message);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadDashboard();
    return () => {
      active = false;
    };
  }, [user?._id]);

  const stats = useMemo(() => {
    if (!dashboardData) return { total: 0, activeMedicines: 0, doctors: 0, alerts: 0 };
    
    // Active Medicines calculation (just unique from backend logic or full list)
    const activeMedicines = dashboardData.topMedicines.length; // Simply count what was returned or we can compute from prescriptions
    
    let alerts = 0;
    prescriptions.forEach((p) => {
      const s = parseStructuredData(p.structuredData) || {};
      const notes = (s.notes || '').toLowerCase();
      if (notes.includes('follow-up') || notes.includes('monitor') || notes.includes('revisit')) alerts++;
    });

    return {
      total: dashboardData.totalPrescriptions,
      activeMedicines: activeMedicines > 0 ? activeMedicines + '+' : 0, 
      doctors: dashboardData.topDoctors.length,
      alerts,
    };
  }, [dashboardData, prescriptions]);

  const topMedicinesData = useMemo(() => {
    return dashboardData?.topMedicines?.map(([name, count]) => ({ name, count })) || [];
  }, [dashboardData]);

  const topDoctorsData = useMemo(() => {
    return dashboardData?.topDoctors?.map(([name, count]) => ({ name, count })) || [];
  }, [dashboardData]);


  if (isLoading) {
    return (
      <div className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <Loader text="Loading dashboard insights..." />
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-none border-l-4 border-medicalBlue bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-medicalBlue">Patient Overview</p>
            <h2 className="mt-2 text-3xl font-serif text-slate-900">Welcome, {user?.name || 'Healthcare User'}</h2>
            <p className="mt-3 font-serif italic text-lg text-slate-600">
              Your Health Insights Dashboard
            </p>
          </div>
          <div>
            <HealthBadge alertCount={alerts.length} />
          </div>
        </div>
      </div>

      {error && <p className="rounded bg-amber-50 px-4 py-3 text-sm font-serif border border-amber-200 text-amber-800">{error}</p>}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Prescriptions" value={stats.total} subtitle="Uploaded records available" />
        <StatsCard title="Active Medicines" value={stats.activeMedicines} subtitle="Top medicines currently tracked" />
        <StatsCard title="Doctors Consulted" value={stats.doctors} subtitle="Specialists visited" />
        <StatsCard title="Health Alerts" value={stats.alerts} subtitle="Records needing follow-up" className={stats.alerts > 0 ? 'border-amber-500' : ''} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 font-serif text-xl text-slate-900">Most Frequently Used Medicines</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMedicinesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 font-serif text-xl text-slate-900">Most Visited Doctors</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topDoctorsData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {topDoctorsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif text-slate-900">Recent Health Alerts</h3>
            <a href="/health-alerts" className="text-sm font-semibold text-medicalBlue hover:underline">
              View All →
            </a>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert, index) => (
              <AlertCard key={index} alert={alert} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-2xl font-serif text-slate-900">Recent Prescription Timeline</h3>
        <RecentPrescriptionsList prescriptions={prescriptions.slice(0, 5)} />
      </div>
    </section>
  );
}

export default DashboardPage;
