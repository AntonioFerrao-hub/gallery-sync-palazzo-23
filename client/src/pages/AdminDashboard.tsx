import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminNavbar } from '@/components/AdminNavbar';
import { FolderOpen, Image, TrendingUp, Eye } from 'lucide-react';
import { Link } from 'wouter';

interface DashboardStats {
  totalCategories: number;
  totalPhotos: number;
  recentPhotos: any[];
  recentCategories: any[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCategories: 0,
    totalPhotos: 0,
    recentPhotos: [],
    recentCategories: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { apiRequest } = useApi();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [categoriesData, photosData] = await Promise.all([
        apiRequest('/api/categories'),
        apiRequest('/api/photos')
      ]);

      setStats({
        totalCategories: categoriesData.length,
        totalPhotos: photosData.length,
        recentPhotos: photosData.slice(0, 5),
        recentCategories: categoriesData.slice(0, 5)
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total de Categorias',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'text-blue-600',
      href: '/admin/categories'
    },
    {
      title: 'Total de Fotos',
      value: stats.totalPhotos,
      icon: Image,
      color: 'text-green-600',
      href: '/admin/photos'
    },
    {
      title: 'Galeria Pública',
      value: 'Ver Site',
      icon: Eye,
      color: 'text-purple-600',
      href: '/'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="mt-2 text-gray-600">Gerencie suas categorias e fotos da galeria</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{card.value}</div>
                  <Link href={card.href}>
                    <Button variant="outline" size="sm">
                      {card.title === 'Galeria Pública' ? 'Visualizar' : 'Gerenciar'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FolderOpen className="mr-2 h-5 w-5" />
                Categorias Recentes
              </CardTitle>
              <CardDescription>
                Últimas categorias criadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-gray-500">Carregando...</p>
              ) : stats.recentCategories.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-500">
                          {category.description || 'Sem descrição'}
                        </p>
                      </div>
                      <Link href={`/admin/categories`}>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">Nenhuma categoria encontrada</p>
                  <Link href="/admin/categories">
                    <Button className="mt-4">Criar Primeira Categoria</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="mr-2 h-5 w-5" />
                Fotos Recentes
              </CardTitle>
              <CardDescription>
                Últimas fotos adicionadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-gray-500">Carregando...</p>
              ) : stats.recentPhotos.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentPhotos.map((photo) => (
                    <div key={photo.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={photo.imageUrl} 
                          alt={photo.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{photo.title}</p>
                          <p className="text-sm text-gray-500">
                            {photo.description?.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                      <Link href={`/admin/photos`}>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">Nenhuma foto encontrada</p>
                  <Link href="/admin/photos">
                    <Button className="mt-4">Adicionar Primeira Foto</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}