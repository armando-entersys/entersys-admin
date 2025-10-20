import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleMDE from 'react-simplemde-editor';
import ReactMarkdown from 'react-markdown';
import { postsApi } from '../api/posts';
import type { UpdatePostInput, Post } from '../types/post';
import { ArrowLeft, Save } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Post no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/posts')}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Editar Post</h1>
                <p className="text-sm text-gray-600">ID: {post.id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                {showPreview ? 'Editar' : 'Vista Previa'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Título del post"
                required
              />
            </div>

            {/* Slug */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="slug-del-post"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                URL del post: /blog/{slug}
              </p>
            </div>

            {/* Meta Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Descripción (SEO)
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción corta para SEO (máximo 160 caracteres)"
                rows={2}
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">
                {metaDescription.length}/160 caracteres
              </p>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Creado</p>
                <p className="text-sm text-gray-900">
                  {new Date(post.created_at).toLocaleString('es-MX')}
                </p>
              </div>
              {post.updated_at && (
                <div>
                  <p className="text-xs text-gray-500">Última actualización</p>
                  <p className="text-sm text-gray-900">
                    {new Date(post.updated_at).toLocaleString('es-MX')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Content Editor/Preview */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido *
            </label>

            {showPreview ? (
              <div className="prose max-w-none border border-gray-300 rounded-md p-4 min-h-[400px]">
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
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/posts')}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={18} />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
