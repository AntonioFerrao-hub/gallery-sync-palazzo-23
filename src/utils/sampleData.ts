import { MediaItem } from '../types';
import { generateId } from './auth';
import auditorioImg from '../assets/auditorio-moderno.jpg';
import casamentoImg from '../assets/casamento-cerimonia.jpg';
import corporativoImg from '../assets/corporativo-conferencia.jpg';

export const createSampleData = (userId: string): MediaItem[] => {
  const sampleMedia: Omit<MediaItem, 'id' | 'userId' | 'createdAt'>[] = [
    {
      title: 'Auditório Moderno',
      category: 'Estrutura',
      type: 'image',
      url: auditorioImg,
      size: 1024000,
      filename: 'auditorio-moderno.jpg'
    },
    {
      title: 'Hall de Recepção',
      category: 'Estrutura', 
      type: 'image',
      url: 'https://picsum.photos/800/500?random=2',
      size: 980000,
      filename: 'hall-recepcao.jpg'
    },
    {
      title: 'Salas de Reunião',
      category: 'Estrutura',
      type: 'image', 
      url: 'https://picsum.photos/800/500?random=3',
      size: 1150000,
      filename: 'salas-reuniao.jpg'
    },
    {
      title: 'Cerimônia Encantadora',
      category: 'Casamento',
      type: 'image',
      url: casamentoImg,
      size: 1200000,
      filename: 'casamento-cerimonia.jpg'
    },
    {
      title: 'Recepção Elegante',
      category: 'Casamento',
      type: 'image',
      url: 'https://picsum.photos/800/500?random=18',
      size: 1100000,
      filename: 'recepcao-elegante.jpg'
    },
    {
      title: 'Bolo de Casamento',
      category: 'Casamento',
      type: 'image',
      url: 'https://picsum.photos/800/500?random=19',
      size: 850000,
      filename: 'bolo-casamento.jpg'
    },
    {
      title: 'Colação de Grau',
      category: 'Formatura',
      type: 'image',
      url: 'https://picsum.photos/800/500?random=9',
      size: 1050000,
      filename: 'colacao-grau.jpg'
    },
    {
      title: 'Baile de Gala',
      category: 'Formatura',
      type: 'image',
      url: 'https://picsum.photos/800/500?random=10',
      size: 1250000,
      filename: 'baile-gala.jpg'
    },
    {
      title: 'Conferências',
      category: 'Corporativo',
      type: 'image',
      url: corporativoImg,
      size: 1180000,
      filename: 'corporativo-conferencia.jpg'
    },
    {
      title: 'Team Building',
      category: 'Corporativo',
      type: 'image',
      url: 'https://picsum.photos/800/500?random=26',
      size: 950000,
      filename: 'team-building.jpg'
    },
    {
      title: 'Lançamentos de Produtos',
      category: 'Corporativo',
      type: 'image',
      url: 'https://picsum.photos/800/500?random=27',
      size: 1300000,
      filename: 'lancamento-produto.jpg'
    },
    {
      title: 'Festas de Aniversário',
      category: 'Eventos Sociais',
      type: 'image',
      url: 'https://picsum.photos/800/500?random=33',
      size: 900000,
      filename: 'festa-aniversario.jpg'
    },
    {
      title: 'Festas de Debutante',
      category: 'Eventos Sociais',
      type: 'image',
      url: 'https://picsum.photos/800/500?random=34',
      size: 1050000,
      filename: 'festa-debutante.jpg'
    },
    {
      title: 'Reuniões Familiares',
      category: 'Eventos Sociais',
      type: 'image',
      url: 'https://picsum.photos/800/500?random=35',
      size: 870000,
      filename: 'reuniao-familiar.jpg'
    }
  ];

  return sampleMedia.map(media => ({
    ...media,
    id: generateId(),
    userId,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Últimos 30 dias
  }));
};

export const initializeSampleData = (userId: string): void => {
  const existingMedia = localStorage.getItem('gallery_media');
  
  // Só adiciona dados de exemplo se não existir nenhuma mídia
  if (!existingMedia) {
    const sampleData = createSampleData(userId);
    localStorage.setItem('gallery_media', JSON.stringify(sampleData));
  }
};