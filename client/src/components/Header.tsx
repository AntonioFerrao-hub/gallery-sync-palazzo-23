import { Button } from './ui/button';
import { LogIn } from 'lucide-react';

const Header = () => {
  const handleAdminAccess = () => {
    window.location.href = '/admin';
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">LEBLOC Gallery</h1>
      <Button onClick={handleAdminAccess} variant="outline" size="sm">
        <LogIn className="h-4 w-4 mr-2" />
        Admin
      </Button>
    </div>
  );
};

export default Header;