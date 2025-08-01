import { Button } from './ui/button';
import { LogIn } from 'lucide-react';
const Header = () => {
  const handleAdminAccess = () => {
    window.location.href = '/admin';
  };
  return <header className="header">
      <nav className="nav-container">
        
        <ul className="nav-menu">
          <li><a href="#estrutura" className="nav-link">Estrutura</a></li>
          <li><a href="#formatura" className="nav-link">Formatura</a></li>
          <li><a href="#casamento" className="nav-link">Casamento</a></li>
          <li><a href="#corporativo" className="nav-link">Corporativo</a></li>
          <li><a href="#eventos-sociais" className="nav-link">Eventos Sociais</a></li>
        </ul>
        
      </nav>
    </header>;
};
export default Header;