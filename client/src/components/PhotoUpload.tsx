import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast';
import { getCurrentUser } from '../utils/auth';

interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
}

const PhotoUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    externalLink: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();

  // Buscar categorias
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Erro ao carregar categorias');
      return response.json();
    }
  });

  // Upload de foto
  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: data
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro no upload');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
      // Reset form
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        externalLink: ''
      });
      setSelectedFile(null);
      toast({ title: 'Foto enviada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro no upload', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const handleFileSelect = async (file: File) => {
    // Verificar tamanho (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast({
        title: 'Arquivo muito grande',
        description: `O arquivo deve ter no máximo 2MB. Seu arquivo tem ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
        variant: 'destructive'
      });
      return;
    }

    // Verificar limite de 20 fotos por categoria
    if (formData.categoryId) {
      try {
        const response = await fetch(`/api/photos/category/${formData.categoryId}`);
        if (response.ok) {
          const photos = await response.json();
          if (photos.length >= 20) {
            toast({
              title: 'Limite excedido',
              description: 'Esta categoria já possui 20 fotos (limite máximo). Remova algumas fotos antes de adicionar novas.',
              variant: 'destructive'
            });
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao verificar limite:', error);
      }
    }

    // Verificar tipo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Tipo de arquivo inválido',
        description: 'Apenas imagens são aceitas (JPG, PNG, GIF, etc.)',
        variant: 'destructive'
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: 'Arquivo obrigatório',
        description: 'Por favor, selecione uma imagem para enviar',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Por favor, insira um título para a foto',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.categoryId) {
      toast({
        title: 'Categoria obrigatória',
        description: 'Por favor, selecione uma categoria',
        variant: 'destructive'
      });
      return;
    }

    const data = new FormData();
    data.append('file', selectedFile);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('categoryId', formData.categoryId);
    data.append('userId', '1'); // ID do usuário admin
    if (formData.externalLink) {
      data.append('externalLink', formData.externalLink);
    }

    uploadMutation.mutate(data);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de Foto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Área de upload */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragOver 
                ? 'border-blue-500 bg-blue-50' 
                : selectedFile 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => {
              if (!selectedFile) {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    handleFileSelect(file);
                  }
                };
                input.click();
              }
            }}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  Remover arquivo
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="text-sm">
                  <strong>Clique para selecionar</strong> ou arraste uma imagem aqui
                </p>
                <p className="text-xs text-muted-foreground">
                  Máximo 1MB • JPG, PNG, GIF
                </p>
              </div>
            )}
          </div>

          {/* Informações da foto */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título da foto"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Categoria *</label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição ou contexto da foto (opcional)"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Link Externo</label>
              <Input
                type="url"
                value={formData.externalLink}
                onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                placeholder="https://... (opcional)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Link para álbum completo, site do fotógrafo, etc.
              </p>
            </div>
          </div>

          {/* Alerta sobre tamanho */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Limite de arquivo:</strong> Máximo 1MB por foto. 
              Para arquivos maiores, recomendamos comprimir a imagem antes do upload.
            </AlertDescription>
          </Alert>

          {/* Botão de envio */}
          <Button 
            type="submit" 
            disabled={uploadMutation.isPending || !selectedFile}
            className="w-full"
            size="lg"
          >
            {uploadMutation.isPending ? 'Enviando...' : 'Enviar Foto'}
          </Button>
        </form>

        {categories.length === 0 && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Nenhuma categoria encontrada. Crie pelo menos uma categoria antes de fazer upload de fotos.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;