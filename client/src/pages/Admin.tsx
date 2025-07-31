import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Upload, LogOut, Users, Plus } from 'lucide-react';
import UploadModal from '../components/UploadModal';
import { logout, getCurrentUser } from '../utils/auth';
import { useToast } from '../hooks/use-toast';
import GallerySection from '../components/GallerySection';
import SimpleMediaModal from '../components/SimpleMediaModal';
import UserManagement from '../components/UserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Admin = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
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
              variant="outline"
              size="sm"
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Galeria
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuários
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="space-y-6">
              <GallerySection showDeleteButton={true} />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <UploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        onUploadSuccess={() => window.location.reload()}
      />
      <SimpleMediaModal />
    </div>
  );
};

export default Admin;