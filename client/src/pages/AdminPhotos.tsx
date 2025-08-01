import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminNavbar } from '@/components/AdminNavbar';
import { PhotoForm } from '@/components/PhotoForm';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface Photo {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  externalLink?: string;
  categoryId: number;
  uploadedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
}

export function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | undefined>();
  const [deletingPhoto, setDeletingPhoto] = useState<Photo | undefined>();
  const { apiRequest } = useApi();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPhotos();
  }, [photos, selectedCategory]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [photosData, categoriesData] = await Promise.all([
        apiRequest('/api/photos'),
        apiRequest('/api/categories')
      ]);
      setPhotos(photosData);
      setCategories(categoriesData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterPhotos = () => {
    if (selectedCategory === 'all') {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(photos.filter(photo => photo.categoryId.toString() === selectedCategory));
    }
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Categoria não encontrada';
  };

  const handleCreatePhoto = () => {
    setEditingPhoto(undefined);
    setShowForm(true);
  };

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
    setShowForm(true);
  };

  const handleDeletePhoto = async (photo: Photo) => {
    try {
      await apiRequest(`/api/photos/${photo.id}`, {
        method: 'DELETE'
      });
      
      toast({
        title: "Foto removida",
        description: "A foto foi removida com sucesso",
      });
      
      setDeletingPhoto(undefined);
      loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao remover foto",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPhoto(undefined);
    loadData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPhoto(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciar Fotos</h1>
              <p className="mt-2 text-gray-600">Adicione e organize fotos nas suas categorias</p>
            </div>
            <Button onClick={handleCreatePhoto}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Foto
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <PhotoForm
              photo={editingPhoto}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {/* Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
              Filtrar por categoria:
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Photos Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando fotos...</p>
          </div>
        ) : filteredPhotos.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{photo.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {getCategoryName(photo.categoryId)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {photo.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {photo.description}
                    </p>
                  )}
                  
                  {photo.externalLink && (
                    <a 
                      href={photo.externalLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center mb-3"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Link externo
                    </a>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {new Date(photo.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPhoto(photo)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingPhoto(photo)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {selectedCategory === 'all' ? 'Nenhuma foto' : 'Nenhuma foto nesta categoria'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {categories.length === 0 
                ? 'Primeiro crie uma categoria, depois adicione fotos.'
                : 'Comece adicionando uma nova foto.'
              }
            </p>
            <div className="mt-6">
              {categories.length === 0 ? (
                <Button onClick={() => window.location.href = '/admin/categories'}>
                  Criar Categoria
                </Button>
              ) : (
                <Button onClick={handleCreatePhoto}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Foto
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingPhoto} onOpenChange={() => setDeletingPhoto(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a foto "{deletingPhoto?.title}"? 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deletingPhoto && handleDeletePhoto(deletingPhoto)}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}