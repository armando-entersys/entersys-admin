import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { emailServiceApi } from '../api/emailService';
import type { EmailProject, EmailProjectCreateResponse } from '../types/email';
import { FolderOpen, Plus, Copy, Eye, EyeOff } from 'lucide-react';

export function EmailProjectsPage() {
  const [projects, setProjects] = useState<EmailProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await emailServiceApi.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const result: EmailProjectCreateResponse = await emailServiceApi.createProject({
        name: newName,
        description: newDescription || undefined,
      });
      setCreatedKey(result.api_key_raw);
      setShowKey(true);
      setNewName('');
      setNewDescription('');
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (project: EmailProject) => {
    try {
      await emailServiceApi.updateProject(project.id, { is_active: !project.is_active });
      loadProjects();
    } catch (error) {
      console.error('Error toggling project:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Proyectos Email</h1>
          <p className="text-sm text-gray-600 mt-1">Gestiona los proyectos registrados en el servicio de email</p>
        </div>
        <Button onClick={() => { setShowCreate(!showCreate); setCreatedKey(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Crear Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nombre del proyecto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <Input
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Descripción opcional"
                />
              </div>
              <Button onClick={handleCreate} disabled={creating || !newName.trim()}>
                {creating ? 'Creando...' : 'Crear Proyecto'}
              </Button>
            </div>

            {/* Show API Key */}
            {createdKey && (
              <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  API Key generada. Copia y guarda de forma segura — no se mostrará de nuevo.
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-white rounded border text-sm font-mono break-all">
                    {showKey ? createdKey : '••••••••••••••••••••••••'}
                  </code>
                  <button onClick={() => setShowKey(!showKey)} className="p-2 hover:bg-yellow-100 rounded">
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => copyToClipboard(createdKey)} className="p-2 hover:bg-yellow-100 rounded">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay proyectos registrados</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/email/projects/${project.id}`)}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-gray-900">{project.name}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          project.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {project.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Prefix: <code>{project.api_key_prefix}</code></span>
                      <span>Rate: {project.rate_limit_per_minute}/min, {project.rate_limit_per_hour}/hr</span>
                      <span>Creado: {new Date(project.created_at).toLocaleDateString('es-MX')}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleActive(project);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      project.is_active
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-entersys-primary text-white hover:bg-entersys-dark'
                    }`}
                  >
                    {project.is_active ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
}
