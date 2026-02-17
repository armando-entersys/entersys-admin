import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { emailServiceApi } from '../api/emailService';
import type { EmailProject, EscalationContact, EmailLog } from '../types/email';
import { ArrowLeft, RotateCw, Copy, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

export function EmailProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = Number(id);

  const [project, setProject] = useState<EmailProject | null>(null);
  const [contacts, setContacts] = useState<EscalationContact[]>([]);
  const [recentLogs, setRecentLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Rotate key state
  const [rotatedKey, setRotatedKey] = useState<string | null>(null);
  const [showRotatedKey, setShowRotatedKey] = useState(false);
  const [rotating, setRotating] = useState(false);

  // Add contact state
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactLevel, setContactLevel] = useState(1);

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      const [proj, conts, logsResp] = await Promise.all([
        emailServiceApi.getProject(projectId),
        emailServiceApi.getEscalationContacts(projectId),
        emailServiceApi.getLogs({ project_id: projectId, page_size: 10 }),
      ]);
      setProject(proj);
      setContacts(conts);
      setRecentLogs(logsResp.items);
    } catch (error) {
      console.error('Error loading project detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRotateKey = async () => {
    if (!confirm('Rotar la API key invalidará la actual. Continuar?')) return;
    setRotating(true);
    try {
      const result = await emailServiceApi.rotateApiKey(projectId);
      setRotatedKey(result.api_key_raw);
      setShowRotatedKey(true);
      loadData();
    } catch (error) {
      console.error('Error rotating key:', error);
    } finally {
      setRotating(false);
    }
  };

  const handleAddContact = async () => {
    if (!contactName.trim() || !contactEmail.trim()) return;
    try {
      await emailServiceApi.createEscalationContact(projectId, {
        name: contactName,
        email: contactEmail,
        level: contactLevel,
      });
      setContactName('');
      setContactEmail('');
      setContactLevel(1);
      setShowAddContact(false);
      loadData();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    if (!confirm('Eliminar este contacto de escalamiento?')) return;
    try {
      await emailServiceApi.deleteEscalationContact(contactId);
      loadData();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Eliminar este proyecto y todos sus datos? Esta acción no se puede deshacer.')) return;
    try {
      await emailServiceApi.deleteProject(projectId);
      navigate('/email/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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

  if (loading || !project) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/email/projects')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              project.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {project.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          {project.description && <p className="text-sm text-gray-600 mt-1">{project.description}</p>}
        </div>
        <Button variant="destructive" size="sm" onClick={handleDeleteProject}>
          Eliminar Proyecto
        </Button>
      </div>

      {/* Project Info + Key Rotation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">API Key Prefix</span><code>{project.api_key_prefix}</code></div>
              <div className="flex justify-between"><span className="text-gray-500">Rate Limit</span><span>{project.rate_limit_per_minute}/min, {project.rate_limit_per_hour}/hr</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Creado por</span><span>{project.created_by || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Creado</span><span>{new Date(project.created_at).toLocaleString('es-MX')}</span></div>
              {project.api_key_expires_at && (
                <div className="flex justify-between"><span className="text-gray-500">Key Expira</span><span>{new Date(project.api_key_expires_at).toLocaleString('es-MX')}</span></div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Key</CardTitle>
            <CardDescription>Rota la key si fue comprometida</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRotateKey} disabled={rotating} variant="outline">
              <RotateCw className="w-4 h-4 mr-2" />
              {rotating ? 'Rotando...' : 'Rotar API Key'}
            </Button>
            {rotatedKey && (
              <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <p className="text-xs font-medium text-yellow-800 mb-2">
                  Nueva API Key — guarda de forma segura:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-white rounded border text-xs font-mono break-all">
                    {showRotatedKey ? rotatedKey : '••••••••••••••••••••'}
                  </code>
                  <button onClick={() => setShowRotatedKey(!showRotatedKey)} className="p-1 hover:bg-yellow-100 rounded">
                    {showRotatedKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  <button onClick={() => copyToClipboard(rotatedKey)} className="p-1 hover:bg-yellow-100 rounded">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Escalation Contacts */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contactos de Escalamiento</CardTitle>
              <CardDescription>L1: primer fallo, L2: ≥3 fallos/hr, L3: ≥10 fallos/hr</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAddContact(!showAddContact)}>
              <Plus className="w-4 h-4 mr-1" />
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddContact && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <Input placeholder="Nombre" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                <Input placeholder="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                <select
                  value={contactLevel}
                  onChange={(e) => setContactLevel(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-entersys-primary"
                >
                  <option value={1}>L1 — Developer</option>
                  <option value={2}>L2 — Admin</option>
                  <option value={3}>L3 — Manager</option>
                </select>
              </div>
              <Button size="sm" onClick={handleAddContact} disabled={!contactName.trim() || !contactEmail.trim()}>
                Guardar Contacto
              </Button>
            </div>
          )}

          {contacts.length === 0 ? (
            <p className="text-sm text-gray-500">Sin contactos de escalamiento configurados</p>
          ) : (
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                      contact.level === 1 ? 'bg-blue-100 text-blue-800' :
                      contact.level === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      L{contact.level}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                    <span className="text-sm text-gray-500">{contact.email}</span>
                  </div>
                  <button onClick={() => handleDeleteContact(contact.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Logs Recientes</CardTitle>
          <CardDescription>Últimos 10 envíos de este proyecto</CardDescription>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-gray-500">Sin envíos registrados</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{log.subject}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{log.to_emails.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    {statusBadge(log.status)}
                    <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString('es-MX')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
