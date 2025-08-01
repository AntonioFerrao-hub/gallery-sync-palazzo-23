import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Edit2, Trash2, Folder, FolderOpen } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

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

  // Buscar contagem de fotos por categoria
  const { data: photoCounts = {} } = useQuery({
    queryKey: ['/api/categories/photos-count', categories],
    queryFn: async () => {
      const counts: Record<number, number> = {};
      
      for (const category of categories) {
        const response = await fetch(`/api/photos/category/${category.id}`);
        if (response.ok) {
          const photos = await response.json();
          counts[category.id] = photos.length;
        }
      }
      
      return counts;
    },
    enabled: categories.length > 0
  });

  // Criar categoria
  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      return await apiRequest('/api/categories', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setIsCreateOpen(false);
      resetForm();
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
      const { id, ...updateData } = data;
      return await apiRequest(`/api/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setEditingCategory(null);
      resetForm();
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
      return await apiRequest(`/api/categories/${id}`, {
        method: 'DELETE'
      });
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome da categoria é obrigatório',
        variant: 'destructive'
      });
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        name: formData.name.trim(),
        description: formData.description.trim()
      });
    } else {
      createMutation.mutate({
        name: formData.name.trim(),
        description: formData.description.trim()
      });
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
    resetForm();
  };

  const handleDelete = (category: Category) => {
    const photoCount = photoCounts[category.id] || 0;
    
    if (photoCount > 0) {
      toast({
        title: 'Operação não permitida',
        description: `Esta categoria possui ${photoCount} foto(s). Remova todas as fotos antes de deletar a categoria.`,
        variant: 'destructive'
      });
      return;
    }

    if (confirm(`Tem certeza que deseja deletar a categoria "${category.name}"?`)) {
      deleteMutation.mutate(category.id);
    }
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
              <DialogDescription>
                Preencha os dados para criar uma nova categoria de fotos
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Casamentos, Formaturas..."
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional da categoria"
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

      {/* Tabela de categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Fotos</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {photoCounts[category.id] > 0 ? (
                        <FolderOpen className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Folder className="h-4 w-4 text-gray-500" />
                      )}
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {category.description || <span className="text-gray-400">Sem descrição</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={photoCounts[category.id] >= 20 ? 'destructive' : 'secondary'}>
                      {photoCounts[category.id] || 0}/20
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
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
                        onClick={() => handleDelete(category)}
                        disabled={deleteMutation.isPending || (photoCounts[category.id] || 0) > 0}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Deletar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de edição */}
      {editingCategory && (
        <Dialog open={true} onOpenChange={() => cancelEdit()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
              <DialogDescription>
                Modifique os dados da categoria selecionada
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Casamentos, Formaturas..."
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional da categoria"
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
    </div>
  );
};

export default CategoryManagement;