import React, { useState, useRef } from 'react';
import { X, Upload, Video, Image as ImageIcon } from 'lucide-react';
import { MediaItem, CATEGORIES, ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from '../types';
import { saveMedia, convertFileToBase64, createVideoThumbnail, formatFileSize } from '../utils/media';
import { getCurrentUser, generateId } from '../utils/auth';
import { useToast } from '../hooks/use-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    const isImage = ALLOWED_IMAGE_TYPES.includes(selectedFile.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(selectedFile.type);

    if (!isImage && !isVideo) {
      toast({
        title: "Erro",
        description: "Tipo de arquivo não suportado. Use JPG, PNG, GIF, MP4 ou WebM.",
        variant: "destructive"
      });
      return;
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (selectedFile.size > maxSize) {
      toast({
        title: "Erro",
        description: `Arquivo muito grande. Máximo ${isImage ? '2MB' : '20GB'} para ${isImage ? 'imagens' : 'vídeos'}.`,
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos e selecione um arquivo.",
        variant: "destructive"
      });
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
      const fileUrl = await convertFileToBase64(file);
      let thumbnailUrl: string | undefined;

      if (isVideo) {
        try {
          thumbnailUrl = await createVideoThumbnail(file);
        } catch (error) {
          console.warn('Não foi possível gerar thumbnail do vídeo:', error);
        }
      }

      const newMedia: MediaItem = {
        id: generateId(),
        title: title.trim(),
        category,
        type: isVideo ? 'video' : 'image',
        url: fileUrl,
        thumbnailUrl,
        userId: user.id,
        createdAt: new Date().toISOString(),
        size: file.size,
        filename: file.name
      };

      saveMedia(newMedia);
      
      toast({
        title: "Sucesso",
        description: "Arquivo enviado com sucesso!"
      });

      // Reset form
      setTitle('');
      setCategory(CATEGORIES[0]);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onUploadSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer upload. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Upload de Mídia</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="auth-input"
                placeholder="Ex: Auditório Moderno"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="auth-input"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Arquivo</label>
              <div
                className={`upload-area ${dragOver ? 'dragover' : ''}`}
                onDragOver={(e) => {e.preventDefault(); setDragOver(true);}}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInputChange}
                  accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
                  className="hidden"
                />
                
                {file ? (
                  <div className="flex items-center gap-3">
                    {ALLOWED_VIDEO_TYPES.includes(file.type) ? (
                      <Video className="text-primary" size={24} />
                    ) : (
                      <ImageIcon className="text-primary" size={24} />
                    )}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="text-muted-foreground" size={32} />
                    <p className="text-muted-foreground">
                      Clique ou arraste arquivos aqui
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Imagens: JPG, PNG, GIF (máx 2MB)<br />
                      Vídeos: MP4, WebM (máx 20GB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !file || !title.trim()}
              className="auth-button"
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;