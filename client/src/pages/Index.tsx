import Header from '../components/Header';
import GallerySection from '../components/GallerySection';
import SimpleMediaModal from '../components/SimpleMediaModal';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GallerySection />
      <SimpleMediaModal />
    </div>
  );
};

export default Index;
