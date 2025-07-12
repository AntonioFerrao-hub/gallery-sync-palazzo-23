import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMediaList } from '../utils/media';
import type { MediaItem } from '../types';

const SimpleMediaModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      const { media, mediaList: list } = event.detail;
      setSelectedMedia(media);
      setMediaList(list);
      setCurrentIndex(list.findIndex((m: MediaItem) => m.id === media.id));
      setIsOpen(true);
    };

    window.addEventListener('openMediaModal', handleOpenModal as EventListener);
    return () => window.removeEventListener('openMediaModal', handleOpenModal as EventListener);
  }, []);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (mediaList.length === 0) return;
    
    const newIndex = direction === 'prev'
      ? (currentIndex - 1 + mediaList.length) % mediaList.length
      : (currentIndex + 1) % mediaList.length;
    
    setCurrentIndex(newIndex);
    setSelectedMedia(mediaList[newIndex]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedMedia(null);
    setMediaList([]);
    setCurrentIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          handleNavigate('prev');
          break;
        case 'ArrowRight':
          handleNavigate('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, mediaList]);

  if (!isOpen || !selectedMedia) return null;

  const canNavigate = mediaList.length > 1;

  return (
    <div id="imageModal" className="modal" style={{ display: 'block' }}>
      <button className="modal-close" onClick={handleClose}>&times;</button>
      <div className="modal-content">
        <div className="modal-navigation">
          <button 
            className="nav-arrow" 
            id="prevArrow"
            onClick={() => handleNavigate('prev')}
            disabled={!canNavigate}
          >
            &lt;
          </button>
          <button 
            className="nav-arrow" 
            id="nextArrow"
            onClick={() => handleNavigate('next')}
            disabled={!canNavigate}
          >
            &gt;
          </button>
        </div>
        
        {selectedMedia.type === 'video' ? (
          <video
            controls
            className="w-full h-auto block object-contain mb-5 max-h-[calc(100vh-150px)]"
            poster={selectedMedia.thumbnailUrl}
          >
            <source src={selectedMedia.url} type="video/mp4" />
            <source src={selectedMedia.url} type="video/webm" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        ) : (
          <img 
            id="modalImage" 
            src={selectedMedia.url} 
            alt={selectedMedia.title}
          />
        )}
        
        <div className="modal-info">
          <h3 id="modalTitle" className="modal-title">{selectedMedia.title}</h3>
          <p id="modalCategory" className="modal-category">{selectedMedia.category}</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleMediaModal;