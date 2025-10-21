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
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Bienvenido al panel de administración</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              {stat.change && (
                <p className="text-xs text-green-600 mt-1">
                  {stat.change} del total
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/posts')}
          className="h-auto py-6 justify-start"
        >
          <Eye className="mr-3 h-5 w-5" />
          <div className="text-left">
            <div className="font-semibold">Ver Posts</div>
            <div className="text-xs text-gray-500 font-normal">Gestiona tus publicaciones</div>
          </div>
        </Button>
        <Button
          size="lg"
          onClick={() => navigate('/posts/new')}
          className="h-auto py-6 justify-start bg-entersys-primary hover:bg-entersys-dark"
        >
          <PlusCircle className="mr-3 h-5 w-5" />
          <div className="text-left">
            <div className="font-semibold">Nuevo Post</div>
            <div className="text-xs text-white/80 font-normal">Crear contenido</div>
          </div>
        </Button>
      </div>

      {/* Recent Posts */}
      {posts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Posts Recientes</CardTitle>
            <CardDescription>Últimas {posts.slice(0, 5).length} publicaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.slice(0, 5).map(post => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
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
