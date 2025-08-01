import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Edit2, Trash2, User, Shield } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

const UserManagement = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar usuários
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Erro ao carregar usuários');
      return response.json();
    }
  });

  // Criar usuário
  const createMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; role: string }) => {
      const response = await apiRequest('/api/users', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: 'Usuário criado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao criar usuário', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  // Atualizar usuário
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; name: string; email: string; role: string; password?: string }) => {
      const { id, ...updateData } = data;
      const response = await apiRequest(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setEditingUser(null);
      resetForm();
      toast({ title: 'Usuário atualizado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao atualizar usuário', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  // Deletar usuário
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/users/${id}`, {
        method: 'DELETE'
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({ title: 'Usuário deletado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao deletar usuário', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({ 
        title: 'Campos obrigatórios', 
        description: 'Nome e email são obrigatórios',
        variant: 'destructive' 
      });
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      toast({ 
        title: 'Senha obrigatória', 
        description: 'A senha é obrigatória para novos usuários',
        variant: 'destructive' 
      });
      return;
    }

    if (editingUser) {
      updateMutation.mutate({
        id: editingUser.id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        ...(formData.password && { password: formData.password })
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    resetForm();
  };

  const handleDelete = (user: User) => {
    if (user.id === 1) {
      toast({
        title: 'Operação não permitida',
        description: 'Não é possível deletar o usuário administrador principal',
        variant: 'destructive'
      });
      return;
    }

    if (confirm(`Tem certeza que deseja deletar o usuário "${user.name}"?`)) {
      deleteMutation.mutate(user.id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando usuários...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para criar um novo usuário no sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Senha *</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Senha"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Função</label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: 'admin' | 'user') => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending ? 'Criando...' : 'Criar Usuário'}
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

      {/* Tabela de usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' ? (
                        <Shield className="h-4 w-4 text-blue-500" />
                      ) : (
                        <User className="h-4 w-4 text-gray-500" />
                      )}
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(user)}
                        className="flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Editar
                      </Button>
                      {user.id !== 1 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(user)}
                          disabled={deleteMutation.isPending}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Deletar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de edição */}
      {editingUser && (
        <Dialog open={true} onOpenChange={() => cancelEdit()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>
                Modifique os dados do usuário selecionado
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nova Senha (opcional)</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Deixe vazio para manter a senha atual"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Função</label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: 'admin' | 'user') => setFormData({ ...formData, role: value })}
                  disabled={editingUser.id === 1}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                {editingUser.id === 1 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    A função do administrador principal não pode ser alterada
                  </p>
                )}
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

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;