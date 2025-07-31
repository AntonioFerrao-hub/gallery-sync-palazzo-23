import { MediaItem } from '../types';

export const MEDIA_STORAGE_KEY = 'gallery_media';

export const saveMedia = (media: MediaItem): void => {
  const mediaList = getMediaList();
  mediaList.push(media);
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(mediaList));
};

export const getMediaList = (): MediaItem[] => {
  const media = localStorage.getItem(MEDIA_STORAGE_KEY);
  return media ? JSON.parse(media) : [];
};

export const getMediaByUserId = (userId: string): MediaItem[] => {
  const mediaList = getMediaList();
  return mediaList.filter(m => m.userId === userId);
};

export const getAllMedia = (): MediaItem[] => {
  return getMediaList();
};

export const deleteMedia = (mediaId: string, userId: string): boolean => {
  const mediaList = getMediaList();
  const mediaIndex = mediaList.findIndex(m => m.id === mediaId && m.userId === userId);
  
  if (mediaIndex >= 0) {
    mediaList.splice(mediaIndex, 1);
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(mediaList));
    return true;
  }
  
  return false;
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const createVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      video.currentTime = 1; // Pega frame no segundo 1
    });
    
    video.addEventListener('seeked', () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail);
      } else {
        reject(new Error('Canvas context not available'));
      }
    });
    
    video.addEventListener('error', reject);
    
    const url = URL.createObjectURL(file);
    video.src = url;
    video.load();
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};