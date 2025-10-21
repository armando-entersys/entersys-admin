import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '../api/posts';
import type { Post } from '../types/post';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Edit, Trash2, Plus, Calendar, FileText } from 'lucide-react';

export function PostsListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await postsApi.getAll(false);
      setPosts(data);
    } catch (error) {
      console.error('Error al cargar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${title}"?`)) {
      return;
    }

    try {
      await postsApi.delete(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar post:', error);
      alert('Error al eliminar el post');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-entersys-text-muted">Cargando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-entersys-text-dark mb-2">
            Posts del Blog
          </h1>
          <p className="text-entersys-text-muted">
            Gestiona todo el contenido de tu blog
          </p>
        </div>
        <Button
          onClick={() => navigate('/posts/new')}
          size="lg"
          className="shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-entersys-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-entersys-text-muted">Total Posts</p>
                <p className="text-3xl font-bold text-entersys-text-dark">{posts.length}</p>
              </div>
              <div className="bg-entersys-light p-3 rounded-lg">
                <FileText className="w-6 h-6 text-entersys-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-entersys-text-muted">Publicados</p>
                <p className="text-3xl font-bold text-entersys-text-dark">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-entersys-text-muted">Borradores</p>
                <p className="text-3xl font-bold text-entersys-text-dark">
                  {posts.filter(p => p.status === 'draft').length}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              Todos ({posts.length})
            </Button>
            <Button
              variant={filter === 'published' ? 'default' : 'outline'}
              onClick={() => setFilter('published')}
              className={filter === 'published' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Publicados ({posts.filter(p => p.status === 'published').length})
            </Button>
            <Button
              variant={filter === 'draft' ? 'default' : 'outline'}
              onClick={() => setFilter('draft')}
              className={filter === 'draft' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
            >
              Borradores ({posts.filter(p => p.status === 'draft').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="bg-entersys-light p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-entersys-primary" />
              </div>
              <h3 className="text-lg font-semibold text-entersys-text-dark mb-2">
                No hay posts para mostrar
              </h3>
              <p className="text-entersys-text-muted mb-6">
                Comienza creando tu primer post para el blog
              </p>
              <Button onClick={() => navigate('/posts/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Post
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-entersys-text-dark truncate">
                        {post.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {post.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    {post.meta_description && (
                      <p className="text-sm text-entersys-text-muted mb-3 line-clamp-2">
                        {post.meta_description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-entersys-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        /{post.slug}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/posts/${post.id}/edit`)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}
