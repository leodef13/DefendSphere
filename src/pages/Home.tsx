import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Activity,
  BarChart3,
  Zap,
  Target,
  HardDrive,
  AlertCircle,
  ExclamationTriangle,
  Info
} from 'lucide-react';
import SecurityHealthChart from '../components/charts/SecurityHealthChart';
import ProblemsOverview from '../components/charts/ProblemsOverview';
import HealthTrendChart from '../components/charts/HealthTrendChart';
import CriticalLevelsChart from '../components/charts/CriticalLevelsChart';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState({
    securityScore: 0,
    activeThreats: 0,
    resolvedIncidents: 0,
    uptime: 0
  });

  useEffect(() => {
    // Анимация метрик
    const animateMetrics = () => {
      const targetMetrics = {
        securityScore: 94,
        activeThreats: 3,
        resolvedIncidents: 127,
        uptime: 99.8
      };

      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setMetrics({
          securityScore: Math.round(targetMetrics.securityScore * progress),
          activeThreats: Math.round(targetMetrics.activeThreats * progress),
          resolvedIncidents: Math.round(targetMetrics.resolvedIncidents * progress),
          uptime: Math.round((targetMetrics.uptime * progress) * 100) / 100
        });

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    animateMetrics();
  }, []);

  const quickActions = [
    {
      title: t('home.quickActions.generateReport'),
      description: t('home.quickActions.generateReportDesc'),
      icon: <BarChart3 className="h-6 w-6" />,
      action: () => console.log('Generate Report'),
      color: 'bg-blue-500'
    },
    {
      title: t('home.quickActions.checkCompliance'),
      description: t('home.quickActions.checkComplianceDesc'),
      icon: <Shield className="h-6 w-6" />,
      action: () => console.log('Check Compliance'),
      color: 'bg-green-500'
    },
    {
      title: t('home.quickActions.viewAlerts'),
      description: t('home.quickActions.viewAlertsDesc'),
      icon: <AlertTriangle className="h-6 w-6" />,
      action: () => console.log('View Alerts'),
      color: 'bg-yellow-500'
    },
    {
      title: t('home.quickActions.systemStatus'),
      description: t('home.quickActions.systemStatusDesc'),
      icon: <Activity className="h-6 w-6" />,
      action: () => console.log('System Status'),
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    {
      type: 'incident',
      message: t('home.activities.incidentResolved'),
      time: '2 minutes ago',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    {
      type: 'alert',
      message: t('home.activities.newAlert'),
      time: '15 minutes ago',
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />
    },
    {
      type: 'update',
      message: t('home.activities.systemUpdate'),
      time: '1 hour ago',
      icon: <Zap className="h-4 w-4 text-blue-500" />
    },
    {
      type: 'scan',
      message: t('home.activities.scanComplete'),
      time: '2 hours ago',
      icon: <Target className="h-4 w-4 text-purple-500" />
    }
  ];

  // Данные для графиков
  const healthTrendData = [
    { date: '2025-08-01', health: 60 },
    { date: '2025-08-10', health: 40 },
    { date: '2025-08-20', health: 55 },
    { date: '2025-08-30', health: 15 }
  ];

  const criticalLevelsData = [
    {
      element: 'Assets',
      green: 20,
      yellow: 10,
      red: 5
    },
    {
      element: 'Compliance',
      green: 15,
      yellow: 15,
      red: 10
    },
    {
      element: 'Suppliers',
      green: 20,
      yellow: 10,
      red: 5
    }
  ];

  const problemsData = [
    { label: 'Assets Monitoring', value: 124, color: 'bg-blue-500' },
    { label: 'Critical Problems', value: 5, color: 'bg-red-500' },
    { label: 'High Problems', value: 12, color: 'bg-orange-500' },
    { label: 'Medium Problems', value: 28, color: 'bg-yellow-500' },
    { label: 'Low Problems', value: 43, color: 'bg-green-500' },
    { label: 'Total Problems', value: 88, color: 'bg-gray-500' }
  ];

  // Функция для расчета дней с последнего скана
  const getDaysSinceLastScan = () => {
    const lastScanDate = new Date('2025-09-07'); // Пример даты последнего скана
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastScanDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="card p-6 fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('home.welcome')}, {user?.username}!
            </h1>
            <p className="text-gray-600 text-lg">
              {t('home.subtitle')}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-br from-[#56a3d9] to-[#134876] rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Security Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Security Health Chart */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Total Security Health</h2>
          <div className="flex items-center justify-center">
            <SecurityHealthChart percentage={75} />
          </div>
          <div className="mt-4 space-y-2 text-center">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Status: Need Attention</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Last scan: {getDaysSinceLastScan()} days ago</span>
            </div>
          </div>
        </div>

        {/* Assets Monitoring */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Assets Monitoring</h2>
          <ProblemsOverview data={problemsData} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Over Time Chart */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Over Time</h2>
          <HealthTrendChart data={healthTrendData} />
        </div>

        {/* Level Critically by Elements Chart */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Level Critically by Elements</h2>
          <CriticalLevelsChart data={criticalLevelsData} />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 metric-card slide-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('home.metrics.securityScore')}</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.securityScore}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${metrics.securityScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card p-6 metric-card slide-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('home.metrics.activeThreats')}</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeThreats}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">{t('home.metrics.threatsDesc')}</p>
          </div>
        </div>

        <div className="card p-6 metric-card slide-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('home.metrics.resolvedIncidents')}</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.resolvedIncidents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">{t('home.metrics.incidentsDesc')}</p>
          </div>
        </div>

        <div className="card p-6 metric-card slide-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('home.metrics.uptime')}</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.uptime}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">{t('home.metrics.uptimeDesc')}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('home.quickActions.title')}</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-[#56a3d9] hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    {React.cloneElement(action.icon, { className: 'h-5 w-5 text-white' })}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-[#134876] transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('home.recentActivities.title')}</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-sm text-[#56a3d9] hover:text-[#134876] font-medium transition-colors">
              {t('home.recentActivities.viewAll')}
            </button>
          </div>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('home.systemStatus.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{t('home.systemStatus.security')}</h3>
            <p className="text-sm text-gray-500">{t('home.systemStatus.securityStatus')}</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{t('home.systemStatus.performance')}</h3>
            <p className="text-sm text-gray-500">{t('home.systemStatus.performanceStatus')}</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{t('home.systemStatus.users')}</h3>
            <p className="text-sm text-gray-500">{t('home.systemStatus.usersStatus')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;