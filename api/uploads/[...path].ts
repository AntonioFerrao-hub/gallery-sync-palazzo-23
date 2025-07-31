import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // For Vercel deployment, static files should be handled differently
  // This is a placeholder that redirects to the actual file storage solution
  
  const { path: filePath } = req.query;
  
  if (!filePath) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }

  // In a production Vercel app, you would:
  // 1. Store files in a cloud storage service (AWS S3, Cloudinary, etc.)
  // 2. Return the appropriate URL or stream the file content
  
  res.status(404).json({ 
    error: 'Arquivo não encontrado - Configure um serviço de armazenamento de arquivos' 
  });
}