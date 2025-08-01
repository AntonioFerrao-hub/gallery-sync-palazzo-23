import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Image as ImageIcon, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'wouter';

interface Photo {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  externalLink?: string;
  categoryId: number;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
}

interface GalleryData {
  category: Category;
  photos: Photo[];
}

export function PublicGallery() {
  const [galleries, setGalleries] = useState<GalleryData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredGalleries, setFilteredGalleries] = useState<GalleryData[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { apiRequest } = useApi();

  useEffect(() => {
    loadGalleryData();
  }, []);

  useEffect(() => {
    filterGalleries();
  }, [galleries, selectedCategory]);

  const loadGalleryData = async () => {
    setIsLoading(true);
    try {
      const [galleriesData, categoriesData] = await Promise.all([
        apiRequest('/api/gallery'),
        apiRequest('/api/categories')
      ]);
      
      setGalleries(galleriesData);
      setCategories(categoriesData);
      
      // Create flat array of all photos for modal navigation
      const allPhotosList = galleriesData.flatMap((gallery: GalleryData) => gallery.photos);
      setAllPhotos(allPhotosList);
    } catch (error) {
      console.error('Erro ao carregar galeria:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterGalleries = () => {
    if (selectedCategory === 'all') {
      setFilteredGalleries(galleries);
    } else {
      setFilteredGalleries(galleries.filter(gallery => gallery.category.id.toString() === selectedCategory));
    }
  };

  const openPhotoModal = (photo: Photo) => {
    setSelectedPhoto(photo);
    const index = allPhotos.findIndex(p => p.id === photo.id);
    setPhotoIndex(index);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (photoIndex + 1) % allPhotos.length 
      : (photoIndex - 1 + allPhotos.length) % allPhotos.length;
    
    setPhotoIndex(newIndex);
    setSelectedPhoto(allPhotos[newIndex]);
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Categoria';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">LEBLOC Gallery</h1>
              <p className="mt-2 text-gray-600">Explore nossas galerias organizadas por categoria</p>
            </div>
            <Link href="/admin">
              <Button variant="outline">
                Área Administrativa
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
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

        {/* Gallery Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Carregando galerias...</p>
          </div>
        ) : filteredGalleries.length > 0 ? (
          <div className="space-y-12">
            {filteredGalleries.map((gallery) => (
              <div key={gallery.category.id} className="space-y-6">
                {/* Category Header */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">{gallery.category.name}</h2>
                  {gallery.category.description && (
                    <p className="mt-2 text-gray-600">{gallery.category.description}</p>
                  )}
                  <Badge variant="secondary" className="mt-2">
                    {gallery.photos.length} {gallery.photos.length === 1 ? 'foto' : 'fotos'}
                  </Badge>
                </div>

                {/* Photos Grid */}
                {gallery.photos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {gallery.photos.map((photo) => (
                      <Card 
                        key={photo.id} 
                        className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() => openPhotoModal(photo)}
                      >
                        <div className="aspect-square relative overflow-hidden">
                          <img 
                            src={photo.imageUrl} 
                            alt={photo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{photo.title}</h3>
                          {photo.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{photo.description}</p>
                          )}
                          {photo.externalLink && (
                            <div className="mt-2">
                              <a 
                                href={photo.externalLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Ver álbum completo
                              </a>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">Nenhuma foto nesta categoria ainda</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {selectedCategory === 'all' ? 'Nenhuma galeria disponível' : 'Nenhuma foto nesta categoria'}
            </h3>
            <p className="mt-2 text-gray-500">
              {categories.length === 0 
                ? 'As galerias estarão disponíveis em breve.'
                : 'Selecione outra categoria ou volte mais tarde.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={closePhotoModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedPhoto && (
            <>
              <div className="relative">
                <img 
                  src={selectedPhoto.imageUrl} 
                  alt={selectedPhoto.title}
                  className="w-full max-h-[70vh] object-contain"
                />
                
                {/* Navigation buttons */}
                {allPhotos.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={() => navigatePhoto('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={() => navigatePhoto('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Close button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                  onClick={closePhotoModal}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedPhoto.title}</DialogTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">
                      {getCategoryName(selectedPhoto.categoryId)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(selectedPhoto.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {selectedPhoto.description && (
                    <DialogDescription className="mt-3 text-base">
                      {selectedPhoto.description}
                    </DialogDescription>
                  )}
                </DialogHeader>

                {selectedPhoto.externalLink && (
                  <div className="mt-4">
                    <a 
                      href={selectedPhoto.externalLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver álbum completo
                    </a>
                  </div>
                )}

                {allPhotos.length > 1 && (
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    Foto {photoIndex + 1} de {allPhotos.length}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}