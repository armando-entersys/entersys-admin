import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { emailServiceApi } from '../api/emailService';
import type { EmailDashboardStats } from '../types/email';
import { Mail, Send, AlertTriangle, FolderOpen, TrendingUp, XCircle } from 'lucide-react';

export function EmailDashboardPage() {
  const [stats, setStats] = useState<EmailDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await emailServiceApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading email stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    { title: 'Enviados Hoy', value: stats.sent_today, icon: Send, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Enviados Semana', value: stats.sent_this_week, icon: TrendingUp, color: 'text-entersys-primary', bg: 'bg-entersys-light' },
    { title: 'Enviados Mes', value: stats.sent_this_month, icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Fallos Hoy', value: stats.failed_today, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Tasa Error', value: `${stats.failure_rate_percent}%`, icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Proyectos Activos', value: `${stats.active_projects}/${stats.total_projects}`, icon: FolderOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Email Service</h1>
        <p className="text-sm text-gray-600 mt-1">
          Dashboard del servicio centralizado de emails
          {stats.pending_escalations > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
              {stats.pending_escalations} alertas pendientes
            </span>
          )}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Top Proyectos (Mes)</CardTitle>
            <CardDescription>Proyectos con mayor volumen de envío</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.top_projects.length === 0 ? (
              <p className="text-sm text-gray-500">Sin datos este mes</p>
            ) : (
              <div className="space-y-3">
                {stats.top_projects.map((project, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{project.name}</span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-600">{project.sent} enviados</span>
                      {project.failed > 0 && (
                        <span className="text-red-600">{project.failed} fallos</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Failures */}
        <Card>
          <CardHeader>
            <CardTitle>Fallos Recientes</CardTitle>
            <CardDescription>Últimos errores de envío</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recent_failures.length === 0 ? (
              <p className="text-sm text-gray-500">Sin fallos recientes</p>
            ) : (
              <div className="space-y-3">
                {stats.recent_failures.slice(0, 5).map((failure) => (
                  <div
                    key={failure.id}
                    className="p-3 rounded-lg bg-red-50 cursor-pointer hover:bg-red-100 transition-colors"
                    onClick={() => navigate(`/email/logs`)}
                  >
                    <p className="text-sm font-medium text-gray-900 truncate">{failure.subject}</p>
                    <p className="text-xs text-red-600 mt-1 truncate">{failure.error_message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {failure.to_emails.join(', ')}
                      {failure.created_at && ` — ${new Date(failure.created_at).toLocaleString('es-MX')}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
