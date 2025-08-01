import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

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

const PublicGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [modalPhoto, setModalPhoto] = useState<Photo | null>(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [currentPhotos, setCurrentPhotos] = useState<Photo[]>([]);

  // Buscar categorias
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Erro ao carregar categorias');
      return response.json();
    }
  });

  // Buscar fotos recentes por categoria (8 fotos mais recentes)
  const { data: categoryPhotos = {} } = useQuery({
    queryKey: ['/api/photos/recent', categories],
    queryFn: async () => {
      const photosMap: Record<number, Photo[]> = {};
      
      for (const category of categories) {
        const response = await fetch(`/api/photos/category/${category.id}/recent?limit=8`);
        if (response.ok) {
          photosMap[category.id] = await response.json();
        }
      }
      
      return photosMap;
    },
    enabled: categories.length > 0
  });

  // Buscar todas as fotos de uma categoria (para modal)
  const fetchCategoryPhotos = async (categoryId: number): Promise<Photo[]> => {
    const response = await fetch(`/api/photos/category/${categoryId}`);
    if (!response.ok) return [];
    return response.json();
  };

  const openModal = async (photo: Photo, photos: Photo[]) => {
    // Se clicou em uma foto da galeria inicial (8 fotos), carregar todas as fotos da categoria
    const allPhotos = photos.length === 8 ? await fetchCategoryPhotos(photo.categoryId) : photos;
    const index = allPhotos.findIndex(p => p.id === photo.id);
    
    setCurrentPhotos(allPhotos);
    setModalPhoto(photo);
    setModalIndex(index);
  };

  const closeModal = () => {
    setModalPhoto(null);
    setCurrentPhotos([]);
    setModalIndex(0);
  };

  const nextPhoto = () => {
    const nextIndex = (modalIndex + 1) % currentPhotos.length;
    setModalIndex(nextIndex);
    setModalPhoto(currentPhotos[nextIndex]);
  };

  const prevPhoto = () => {
    const prevIndex = modalIndex === 0 ? currentPhotos.length - 1 : modalIndex - 1;
    setModalIndex(prevIndex);
    setModalPhoto(currentPhotos[prevIndex]);
  };



  // Adicionar listener de teclado
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (!modalPhoto) return;
      
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') closeModal();
    };

    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [modalPhoto, modalIndex, currentPhotos]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Filtros de categoria */}
      <div className="flex flex-wrap gap-2 justify-center px-4">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
        >
          Todas as Categorias
        </Button>
        {categories.map((category: Category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Galerias por categoria */}
      <div className="space-y-12 px-4">
        {categories
          .filter((category: Category) => 
            selectedCategory === null || category.id === selectedCategory
          )
          .map((category: Category) => {
            const photos = categoryPhotos[category.id] || [];
            
            if (photos.length === 0) return null;

            return (
              <div key={category.id} className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold">{category.name}</h2>
                  {category.description && (
                    <p className="text-muted-foreground max-w-2xl mx-auto px-4">
                      {category.description}
                    </p>
                  )}
                  <Badge variant="secondary">
                    {photos.length === 8 ? '8+ fotos' : `${photos.length} fotos`}
                  </Badge>
                </div>

                {/* Grid de fotos centralizado */}
                <div className="flex justify-center">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl w-full">
                    {photos.map((photo: Photo) => (
                      <Card 
                        key={photo.id} 
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => openModal(photo, photos)}
                      >
                        <CardContent className="p-0">
                          <div className="aspect-square relative">
                            <img
                              src={photo.imageUrl}
                              alt={photo.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                              <div className="text-white opacity-0 hover:opacity-100 transition-opacity text-center p-4">
                                <h3 className="font-semibold text-sm mb-1">{photo.title}</h3>
                                {photo.description && (
                                  <p className="text-xs line-clamp-2">{photo.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Ver mais fotos (se houver exatamente 8 fotos, significa que tem mais) */}
                {photos.length === 8 && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const allPhotos = await fetchCategoryPhotos(category.id);
                        if (allPhotos.length > 0) {
                          openModal(allPhotos[0], allPhotos);
                        }
                      }}
                    >
                      Ver todas as fotos da categoria
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Modal de visualização */}
      {modalPhoto && (
        <Dialog open={true} onOpenChange={closeModal}>
          <DialogContent className="max-w-4xl w-full h-[90vh] p-0" aria-describedby="modal-description">
            <div className="relative w-full h-full flex flex-col">
              {/* Header com DialogTitle para acessibilidade */}
              <DialogTitle className="sr-only">{modalPhoto.title}</DialogTitle>
              <div id="modal-description" className="sr-only">
                Visualizando foto {modalIndex + 1} de {currentPhotos.length} na galeria
              </div>
              <div className="flex justify-between items-center p-4 border-b bg-background">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{modalPhoto.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {modalIndex + 1} de {currentPhotos.length} fotos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {modalPhoto.externalLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a 
                        href={modalPhoto.externalLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Ver mais
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeModal}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Imagem */}
              <div className="flex-1 relative bg-black">
                <img
                  src={modalPhoto.imageUrl}
                  alt={modalPhoto.title}
                  className="w-full h-full object-contain"
                />
                
                {/* Navegação - Botões maiores e mais visíveis */}
                {currentPhotos.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-black shadow-lg z-10"
                      onClick={prevPhoto}
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-black shadow-lg z-10"
                      onClick={nextPhoto}
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                  </>
                )}
              </div>

              {/* Footer */}
              {modalPhoto.description && (
                <div className="p-4 border-t bg-background">
                  <p className="text-sm">{modalPhoto.description}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Estado vazio */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma categoria encontrada.</p>
        </div>
      )}

      {categories.length > 0 && Object.keys(categoryPhotos).length > 0 && 
       Object.values(categoryPhotos).every((photos: Photo[]) => photos.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma foto encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default PublicGallery;