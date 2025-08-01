import Header from '../components/Header';
import PublicGallery from '../components/PublicGallery';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <PublicGallery />
      </div>
    </div>
  );
};

export default Index;
