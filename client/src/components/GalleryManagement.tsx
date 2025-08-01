import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trash2, ExternalLink, Eye, Image as ImageIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
}

interface Photo {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  externalLink: string | null;
  categoryId: number;
  uploadedBy: number;
  createdAt: string;
  updatedAt: string;
}

const GalleryManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar categorias
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Erro ao carregar categorias');
      return response.json();
    }
  });

  // Buscar fotos baseado na categoria selecionada
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['/api/photos', selectedCategory],
    queryFn: async () => {
      const endpoint = selectedCategory === 'all' 
        ? '/api/photos' 
        : `/api/photos/category/${selectedCategory}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Erro ao carregar fotos');
      return response.json();
    }
  });

  // Deletar foto
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/photos/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories/photos-count'] });
      toast({ title: 'Foto deletada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao deletar foto', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const handleDelete = (photo: Photo) => {
    if (confirm(`Tem certeza que deseja deletar a foto "${photo.title}"?`)) {
      deleteMutation.mutate(photo.id);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat: Category) => cat.id === categoryId);
    return category?.name || 'Categoria não encontrada';
  };

  const getCategoryPhotosCount = (categoryId: number) => {
    return photos.filter((photo: Photo) => photo.categoryId === categoryId).length;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando fotos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Galeria</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filtrar por categoria:</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name} ({getCategoryPhotosCount(category.id)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total de Fotos</p>
                <p className="text-2xl font-bold">{photos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {categories.slice(0, 3).map((category: Category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Badge variant={getCategoryPhotosCount(category.id) >= 20 ? 'destructive' : 'secondary'}>
                  {getCategoryPhotosCount(category.id)}/20
                </Badge>
                <div>
                  <p className="text-sm text-gray-600">{category.name}</p>
                  <p className="text-lg font-semibold">{getCategoryPhotosCount(category.id)} fotos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grid de fotos */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCategory === 'all' 
              ? `Todas as fotos (${photos.length})` 
              : `${getCategoryName(parseInt(selectedCategory))} (${photos.length})`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {selectedCategory === 'all' 
                  ? 'Nenhuma foto foi enviada ainda' 
                  : 'Esta categoria não possui fotos'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {photos.map((photo: Photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedPhoto(photo)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(photo)}
                        disabled={deleteMutation.isPending}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Deletar
                      </Button>
                    </div>
                  </div>

                  {/* Info da foto */}
                  <div className="mt-2">
                    <p className="text-sm font-medium truncate">{photo.title}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryName(photo.categoryId)}
                      </Badge>
                      {photo.externalLink && (
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de visualização */}
      {selectedPhoto && (
        <Dialog open={true} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedPhoto.title}</DialogTitle>
              <DialogDescription>
                Categoria: {getCategoryName(selectedPhoto.categoryId)}
                {selectedPhoto.description && ` • ${selectedPhoto.description}`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-96 object-contain rounded-lg"
                />
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Enviado em: {new Date(selectedPhoto.createdAt).toLocaleDateString('pt-BR')}</span>
                {selectedPhoto.externalLink && (
                  <a 
                    href={selectedPhoto.externalLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Link externo
                  </a>
                )}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedPhoto);
                    setSelectedPhoto(null);
                  }}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Deletar Foto
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPhoto(null)}
                  className="flex-1"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GalleryManagement;