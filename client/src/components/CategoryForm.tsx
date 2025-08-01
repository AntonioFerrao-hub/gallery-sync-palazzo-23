import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

interface Category {
  id?: number;
  name: string;
  description?: string;
  slug?: string;
}

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const { apiRequest } = useApi();
  const { toast } = useToast();

  const isEditing = !!category?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = { name, description };
      
      if (isEditing) {
        await apiRequest(`/api/categories/${category.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast({
          title: "Categoria atualizada",
          description: "A categoria foi atualizada com sucesso",
        });
      } else {
        await apiRequest('/api/categories', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast({
          title: "Categoria criada",
          description: "A categoria foi criada com sucesso",
        });
      }

      onSuccess();
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
        <CardTitle>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Atualize as informações da categoria' : 'Crie uma nova categoria para organizar suas fotos'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Categoria</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Casamentos, Formaturas, Eventos Corporativos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Breve descrição sobre esta categoria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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