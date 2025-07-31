import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Trash2, Play } from 'lucide-react';
import { getMediaList, deleteMedia } from '../utils/media';
import { getCurrentUser } from '../utils/auth';
import { useToast } from '../hooks/use-toast';
import type { MediaItem } from '../types';

interface GallerySectionProps {
  showDeleteButton?: boolean;
}

const GallerySection = ({ showDeleteButton = false }: GallerySectionProps) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const { toast } = useToast();
  const user = getCurrentUser();

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = () => {
    const items = getMediaList();
    setMediaItems(items);
  };

  const canDelete = (item: MediaItem) => {
    return showDeleteButton && user && item.userId === user.id;
  };

  const handleDelete = async (item: MediaItem) => {
    if (!user) return;
    
    try {
      const success = deleteMedia(item.id, user.id);
      if (success) {
        loadMedia();
        toast({
          title: "Sucesso",
          description: "Mídia deletada com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível deletar a mídia.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar mídia.",
        variant: "destructive",
      });
    }
  };

  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
    // Trigger modal through global state or context
    window.dispatchEvent(new CustomEvent('openMediaModal', { 
      detail: { media, mediaList: mediaItems } 
    }));
  };

  const groupedMedia = mediaItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MediaItem[]>);

  const sections = [
    { title: 'Nossa Estrutura', id: 'estrutura', category: 'Estrutura' },
    { title: 'Formaturas Memoráveis', id: 'formatura', category: 'Formatura' },
    { title: 'Casamentos dos Sonhos', id: 'casamento', category: 'Casamento' },
    { title: 'Eventos Corporativos de Sucesso', id: 'corporativo', category: 'Corporativo' },
    { title: 'Eventos Sociais Inesquecíveis', id: 'eventos-sociais', category: 'Eventos Sociais' }
  ];

  if (mediaItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Galeria em construção</h2>
        <p className="text-muted-foreground">
          Em breve teremos fotos e vídeos dos nossos eventos!
        </p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        {sections.map(section => {
          const categoryItems = groupedMedia[section.category] || [];
          if (categoryItems.length === 0) return null;
          
          return (
            <section key={section.id} id={section.id} className="section">
              <h2 className="section-title">{section.title}</h2>
              <div className="gallery-grid">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="gallery-item"
                    onClick={() => handleMediaClick(item)}
                  >
                    {item.type === 'video' ? (
                      <div className="relative">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-[250px] object-cover"
                          />
                        ) : (
                          <video
                            src={item.url}
                            className="w-full h-[250px] object-cover"
                            muted
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="bg-white/90 rounded-full p-3">
                            <Play className="text-black" size={24} fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-[250px] object-cover"
                      />
                    )}
                    
                    <div className="gallery-overlay">
                      <h3 className="gallery-title">{item.title}</h3>
                      <p className="gallery-category">{item.category}</p>
                    </div>
                    
                    {canDelete(item) && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default GallerySection;