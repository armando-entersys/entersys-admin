import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '../api/posts';
import type { Post } from '../types/post';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, FilePlus, TrendingUp, Calendar, Eye, PlusCircle } from 'lucide-react';

export function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await postsApi.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-entersys-text-muted">Cargando...</div>
        </div>
      </Layout>
    );
  }

  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const draftPosts = posts.filter(p => p.status === 'draft').length;
  const publishRate = totalPosts > 0 ? ((publishedPosts / totalPosts) * 100).toFixed(0) : 0;

  const stats = [
    {
      title: 'Total Posts',
      value: totalPosts,
      change: null,
      icon: FileText,
      color: 'text-entersys-primary',
      bgColor: 'bg-entersys-light',
    },
    {
      title: 'Publicados',
      value: publishedPosts,
      change: `${publishRate}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Borradores',
      value: draftPosts,
      change: null,
      icon: FilePlus,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-entersys-text-dark mb-2">
          Dashboard
        </h1>
        <p className="text-entersys-text-muted">
          Bienvenido al panel de administración del blog
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-entersys-text-muted">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-entersys-text-dark">
                  {stat.value}
                </div>
                {stat.change && (
                  <span className="text-sm font-medium text-green-600">
                    {stat.change}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Gestiona el contenido de tu blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/posts')}
              className="h-auto py-4"
            >
              <Eye className="w-5 h-5 mr-2" />
              Ver Todos los Posts
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/posts/new')}
              className="h-auto py-4"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Crear Nuevo Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      {posts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Posts Recientes</CardTitle>
            <CardDescription>
              Tus publicaciones más recientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {posts.slice(0, 5).map(post => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-entersys-primary hover:bg-entersys-light/30 transition-all cursor-pointer"
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-entersys-text-dark truncate">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-entersys-text-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {post.status === 'published' ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}
