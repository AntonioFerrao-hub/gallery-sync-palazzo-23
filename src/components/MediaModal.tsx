import React from 'react';
import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { MediaItem } from '../types';
import { getCurrentUser } from '../utils/auth';
import { deleteMedia } from '../utils/media';
import { useToast } from '../hooks/use-toast';

interface MediaModalProps {
  isOpen: boolean;
  media: MediaItem | null;
  mediaList: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onDelete: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  media,
  mediaList,
  currentIndex,
  onClose,
  onNavigate,
  onDelete
}) => {
  const user = getCurrentUser();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!media || !user) return;

    if (window.confirm('Tem certeza que deseja deletar esta mídia?')) {
      const success = deleteMedia(media.id, user.id);
      
      if (success) {
        toast({
          title: "Sucesso",
          description: "Mídia deletada com sucesso!"
        });
        onDelete();
        onClose();
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível deletar a mídia.",
          variant: "destructive"
        });
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        onNavigate('prev');
        break;
      case 'ArrowRight':
        onNavigate('next');
        break;
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !media) return null;

  const canNavigate = mediaList.length > 1;
  const canDelete = user?.id === media.userId;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <button className="modal-close" onClick={onClose}>
        <X size={24} />
      </button>
      
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {canNavigate && (
          <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center transform -translate-y-1/2 z-50 px-2 pointer-events-none">
            <button
              className="nav-arrow"
              onClick={(e) => {e.stopPropagation(); onNavigate('prev');}}
              disabled={!canNavigate}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="nav-arrow"
              onClick={(e) => {e.stopPropagation(); onNavigate('next');}}
              disabled={!canNavigate}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {media.type === 'video' ? (
          <video
            controls
            className="w-full h-auto block object-contain mb-5 max-h-[calc(100vh-150px)] rounded-lg"
            poster={media.thumbnailUrl}
          >
            <source src={media.url} type="video/mp4" />
            <source src={media.url} type="video/webm" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        ) : (
          <img
            src={media.url}
            alt={media.title}
            className="w-full h-auto block object-contain mb-5 max-h-[calc(100vh-150px)] rounded-lg"
          />
        )}

        <div className="modal-info">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="modal-title">{media.title}</h3>
              <p className="modal-category">{media.category}</p>
            </div>
            
            {canDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Deletar
              </button>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Adicionado por: {user?.id === media.userId ? 'Você' : 'Outro usuário'}</p>
            <p>Data: {new Date(media.createdAt).toLocaleDateString('pt-BR')}</p>
            <p>Tipo: {media.type === 'video' ? 'Vídeo' : 'Imagem'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;