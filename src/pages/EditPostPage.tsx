import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleMDE from 'react-simplemde-editor';
import ReactMarkdown from 'react-markdown';
import { postsApi } from '../api/posts';
import type { UpdatePostInput, Post } from '../types/post';
import { ArrowLeft, Save, Eye, Edit3, AlertCircle, Clock, Calendar } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import 'easymde/dist/easymde.min.css';

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    if (!id) return;

    try {
      const data = await postsApi.getById(parseInt(id));
      setPost(data);
      setTitle(data.title);
      setSlug(data.slug);
      setContent(data.content);
      setMetaDescription(data.meta_description || '');
      setStatus(data.status);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar el post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!title.trim()) {
      setError('El título es requerido');
      setSaving(false);
      return;
    }

    if (!slug.trim()) {
      setError('El slug es requerido');
      setSaving(false);
      return;
    }

    if (!content.trim()) {
      setError('El contenido es requerido');
      setSaving(false);
      return;
    }

    try {
      const input: UpdatePostInput = {
        title: title.trim(),
        slug: slug.trim(),
        content: content.trim(),
        status,
        meta_description: metaDescription.trim() || undefined,
      };

      await postsApi.update(parseInt(id!), input);
      navigate('/posts');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al actualizar el post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-gray-600">Cargando post...</div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Post no encontrado</h2>
            <p className="text-sm text-gray-600 mb-4">El post que buscas no existe</p>
            <Button onClick={() => navigate('/posts')}>
              <ArrowLeft className="w-4 h-4" />
              Volver a Posts
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/posts')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Post</h1>
              <p className="text-sm text-gray-500">ID: {post.id}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <Edit3 className="w-4 h-4" />
                Editar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Vista Previa
              </>
            )}
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>Título, URL y metadatos del post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título *
                </label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título del post"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Slug (URL) *
                </label>
                <Input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="slug-del-post"
                  required
                />
                <p className="text-xs text-gray-500">
                  URL del post: /blog/{slug}
                </p>
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <label htmlFor="meta" className="block text-sm font-medium text-gray-700">
                  Meta Descripción (SEO)
                </label>
                <textarea
                  id="meta"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-entersys-primary focus-visible:ring-1 focus-visible:ring-entersys-primary disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Descripción corta para SEO (máximo 160 caracteres)"
                  rows={2}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500">
                  {metaDescription.length}/160 caracteres
                </p>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:border-entersys-primary focus-visible:ring-1 focus-visible:ring-entersys-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">Creado</p>
                    <p className="text-sm text-gray-900">
                      {new Date(post.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                {post.updated_at && (
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Última actualización</p>
                      <p className="text-sm text-gray-900">
                        {new Date(post.updated_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contenido *</CardTitle>
              <CardDescription>Usa Markdown para formatear el contenido</CardDescription>
            </CardHeader>
            <CardContent>
              {showPreview ? (
                <div className="prose prose-sm max-w-none border border-gray-300 rounded-md p-4 min-h-[400px] bg-white">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <SimpleMDE
                  value={content}
                  onChange={setContent}
                  options={{
                    spellChecker: false,
                    placeholder: 'Escribe el contenido del post en Markdown...',
                    status: false,
                    minHeight: '400px',
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/posts')}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
