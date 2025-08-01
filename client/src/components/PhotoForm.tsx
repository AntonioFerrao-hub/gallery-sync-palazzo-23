import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Upload } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
}

interface Photo {
  id?: number;
  title: string;
  description?: string;
  imageUrl: string;
  externalLink?: string;
  categoryId: number;
}

interface PhotoFormProps {
  photo?: Photo;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PhotoForm({ photo, onSuccess, onCancel }: PhotoFormProps) {
  const [title, setTitle] = useState(photo?.title || '');
  const [description, setDescription] = useState(photo?.description || '');
  const [externalLink, setExternalLink] = useState(photo?.externalLink || '');
  const [categoryId, setCategoryId] = useState<string>(photo?.categoryId?.toString() || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const { apiRequest, uploadFile } = useApi();
  const { toast } = useToast();

  const isEditing = !!photo?.id;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const data = await apiRequest('/api/categories');
      setCategories(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar categorias",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isEditing && !imageFile) {
        throw new Error('Selecione uma imagem');
      }

      if (!categoryId) {
        throw new Error('Selecione uma categoria');
      }

      // Handle image upload with base64 conversion for Vercel compatibility
      if (imageFile) {
        // Convert file to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });

        const data = {
          title,
          description,
          categoryId,
          externalLink,
          imageUrl: base64
        };

        await apiRequest('/api/photos', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        
        toast({
          title: isEditing ? "Foto atualizada" : "Foto adicionada",
          description: "A foto foi salva com sucesso",
        });
        
        onSuccess();
        return;
      }

      // Update existing photo (without image change)
      if (isEditing) {
        const data = { title, description, externalLink };
        await apiRequest(`/api/photos/${photo.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        
        toast({
          title: "Foto atualizada",
          description: "A foto foi atualizada com sucesso",
        });
        
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Foto' : 'Nova Foto'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Atualize as informações da foto' : 'Adicione uma nova foto à galeria'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Foto</Label>
            <Input
              id="title"
              type="text"
              placeholder="Ex: Cerimônia de Formatura 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={isEditing}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingCategories ? "Carregando..." : "Selecione uma categoria"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="image">Imagem</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva o contexto da foto, evento, pessoas presentes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="externalLink">Link Externo (opcional)</Label>
            <Input
              id="externalLink"
              type="url"
              placeholder="Ex: link para álbum completo, site do fotógrafo..."
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}