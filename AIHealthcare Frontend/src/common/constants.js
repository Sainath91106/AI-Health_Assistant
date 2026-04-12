export const APP_NAME = 'AI-Powered Personal Healthcare Assistant';

export const TOKEN_STORAGE_KEY = 'healthcare_jwt_token';
export const USER_STORAGE_KEY = 'healthcare_user';

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Upload Prescription', path: '/prescriptions/upload' },
  { label: 'Prescription History', path: '/prescriptions/history' },
  { label: 'AI Chat Assistant', path: '/chat' },
  { label: 'Search Prescriptions', path: '/search' },
  { label: 'Diet Plan Generator', path: '/diet-plan' },
  { label: 'Health Alerts', path: '/health-alerts' },
  { label: 'Profile', path: '/profile' },
];

export const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/prescriptions/upload': 'Upload Prescription',
  '/prescriptions/history': 'Prescription History',
  '/chat': 'AI Chat Assistant',
  '/search': 'Search Prescriptions',
  '/diet-plan': 'Diet Plan Generator',
  '/health-alerts': 'Health Alerts',
  '/profile': 'Profile',
};
