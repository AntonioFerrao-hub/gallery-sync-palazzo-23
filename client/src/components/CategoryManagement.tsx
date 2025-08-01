import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast';

interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const CategoryManagement = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar categorias
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Erro ao carregar categorias');
      return response.json();
    }
  });

  // Criar categoria
  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar categoria');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setIsCreateOpen(false);
      setFormData({ name: '', description: '' });
      toast({ title: 'Categoria criada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao criar categoria', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  // Atualizar categoria
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; name: string; description: string }) => {
      const response = await fetch(`/api/categories/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, description: data.description })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar categoria');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
      toast({ title: 'Categoria atualizada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao atualizar categoria', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  // Deletar categoria
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao deletar categoria');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ title: 'Categoria deletada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao deletar categoria', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ 
        title: 'Nome obrigatório', 
        description: 'Por favor, insira um nome para a categoria',
        variant: 'destructive' 
      });
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        name: formData.name,
        description: formData.description
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando categorias...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Categoria</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome da categoria"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da categoria (opcional)"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending ? 'Criando...' : 'Criar Categoria'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category: Category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <Badge variant="secondary">{category.slug}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {category.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(category)}
                  className="flex items-center gap-1"
                >
                  <Edit2 className="h-3 w-3" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
                      deleteMutation.mutate(category.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Deletar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de edição */}
      {editingCategory && (
        <Dialog open={true} onOpenChange={() => cancelEdit()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome da categoria"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da categoria (opcional)"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                  className="flex-1"
                >
                  {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={cancelEdit}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {categories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma categoria encontrada.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Clique em "Nova Categoria" para criar sua primeira categoria.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;