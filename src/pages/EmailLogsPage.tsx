import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { emailServiceApi } from '../api/emailService';
import type { EmailLog, EmailProject } from '../types/email';
import { ScrollText, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [projects, setProjects] = useState<EmailProject[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [projectFilter, setProjectFilter] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const pageSize = 20;

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [page, projectFilter, statusFilter, search]);

  const loadProjects = async () => {
    try {
      const data = await emailServiceApi.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await emailServiceApi.getLogs({
        project_id: projectFilter,
        status: statusFilter,
        search: search || undefined,
        page,
        page_size: pageSize,
      });
      setLogs(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const totalPages = Math.ceil(total / pageSize);

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      queued: 'bg-yellow-100 text-yellow-800',
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Bitácora de Emails</h1>
        <p className="text-sm text-gray-600 mt-1">Registro completo de todos los emails enviados</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={projectFilter ?? ''}
              onChange={(e) => { setProjectFilter(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-entersys-primary"
            >
              <option value="">Todos los proyectos</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={statusFilter ?? ''}
              onChange={(e) => { setStatusFilter(e.target.value || undefined); setPage(1); }}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-entersys-primary"
            >
              <option value="">Todos los status</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
              <option value="queued">Queued</option>
            </select>

            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar por asunto o error..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button size="sm" variant="outline" onClick={handleSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <span className="text-sm text-gray-500">{total} registros</span>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Cargando...</div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ScrollText className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No se encontraron registros</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Proyecto</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Asunto</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Destinatarios</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('es-MX')}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium">{log.project_name || `#${log.project_id}`}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate">{log.subject}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate">
                        {log.to_emails.join(', ')}
                      </td>
                      <td className="px-4 py-3">{statusBadge(log.status)}</td>
                      <td className="px-4 py-3 text-xs text-red-500 max-w-[200px] truncate">
                        {log.error_message || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            Página {page} de {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
