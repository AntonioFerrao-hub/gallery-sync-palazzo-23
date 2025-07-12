import { Button } from './ui/button';
import { LogIn } from 'lucide-react';

const Header = () => {
  const handleAdminAccess = () => {
    window.location.href = '/admin';
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo">LEBLOC</div>
        <ul className="nav-menu">
          <li><a href="#estrutura" className="nav-link">Estrutura</a></li>
          <li><a href="#formatura" className="nav-link">Formatura</a></li>
          <li><a href="#casamento" className="nav-link">Casamento</a></li>
          <li><a href="#corporativo" className="nav-link">Corporativo</a></li>
          <li><a href="#eventos-sociais" className="nav-link">Eventos Sociais</a></li>
        </ul>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdminAccess}
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Admin
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;