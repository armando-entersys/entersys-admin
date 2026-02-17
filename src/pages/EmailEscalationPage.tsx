import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { emailServiceApi } from '../api/emailService';
import type { EscalationEvent, EmailProject } from '../types/email';
import { AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export function EmailEscalationPage() {
  const [events, setEvents] = useState<EscalationEvent[]>([]);
  const [projects, setProjects] = useState<EmailProject[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [projectFilter, setProjectFilter] = useState<number | undefined>(undefined);

  const pageSize = 20;

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadEvents();
  }, [page, projectFilter]);

  const loadProjects = async () => {
    try {
      const data = await emailServiceApi.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await emailServiceApi.getEscalationEvents({
        project_id: projectFilter,
        page,
        page_size: pageSize,
      });
      setEvents(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading escalation events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (eventId: number) => {
    try {
      await emailServiceApi.acknowledgeEvent(eventId);
      loadEvents();
    } catch (error) {
      console.error('Error acknowledging event:', error);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const levelBadge = (level: number) => {
    const styles: Record<number, string> = {
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-red-100 text-red-800',
    };
    const labels: Record<number, string> = {
      1: 'L1 — Dev',
      2: 'L2 — Admin',
      3: 'L3 — Manager',
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-bold rounded ${styles[level] || 'bg-gray-100 text-gray-600'}`}>
        {labels[level] || `L${level}`}
      </span>
    );
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Escalamiento</h1>
        <p className="text-sm text-gray-600 mt-1">Eventos de escalamiento por fallos de envío</p>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
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
            <span className="text-sm text-gray-500">{total} eventos</span>
          </div>
        </CardContent>
      </Card>

      {/* Events Timeline */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Cargando...</div>
        </div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-green-300 mb-4" />
            <p className="text-gray-500">No hay eventos de escalamiento</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className={event.acknowledged_at ? 'opacity-60' : ''}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {event.acknowledged_at ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {levelBadge(event.level)}
                        {event.project_name && (
                          <span className="text-xs text-gray-500">{event.project_name}</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {event.email_subject || 'Sin asunto'}
                      </p>
                      <p className="text-xs text-red-500 mt-1">{event.error_message || '—'}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>Notificado: {event.contact_name} ({event.contact_email})</span>
                        <span>{new Date(event.notified_at).toLocaleString('es-MX')}</span>
                        {event.acknowledged_at && (
                          <span className="text-green-600">
                            Reconocido: {new Date(event.acknowledged_at).toLocaleString('es-MX')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!event.acknowledged_at && (
                    <Button size="sm" variant="outline" onClick={() => handleAcknowledge(event.id)}>
                      Acknowledge
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
