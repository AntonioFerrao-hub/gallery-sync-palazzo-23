import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Upload, LogOut, Users, Plus, Images } from 'lucide-react';
import { logout, getCurrentUser } from '../utils/auth';
import { useToast } from '../hooks/use-toast';
import UserManagement from '../components/UserManagement';
import CategoryManagement from '../components/CategoryManagement';
import PhotoUpload from '../components/PhotoUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const { toast } = useToast();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="header">
        <nav className="nav-container">
          <div className="logo">LEBLOC - Admin</div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair ({user?.name})
            </Button>
          </div>
        </nav>
      </header>

      <div className="main-content">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Images className="h-4 w-4" />
                Categorias
              </TabsTrigger>
              <TabsTrigger value="photos" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuários
              </TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-6">
              <CategoryManagement />
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <PhotoUpload />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;