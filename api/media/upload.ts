import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configure formidable for file uploads
const parseForm = (req: VercelRequest): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 20 * 1024 * 1024 * 1024, // 20GB
      uploadDir: '/tmp',
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { fields, files } = await parseForm(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Generate unique filename
    const uniqueId = uuidv4();
    const fileExtension = path.extname(file.originalFilename || '');
    const filename = `${uniqueId}${fileExtension}`;

    // Read file content
    const fileContent = await fs.readFile(file.filepath);
    
    // In a real Vercel deployment, you would upload to a cloud storage service
    // For now, we'll return the file as base64 for localStorage storage
    const base64Content = fileContent.toString('base64');

    const mediaItem = {
      id: uniqueId,
      title: Array.isArray(fields.title) ? fields.title[0] : fields.title,
      category: Array.isArray(fields.category) ? fields.category[0] : fields.category,
      type: file.mimetype?.startsWith('video/') ? 'video' : 'image',
      url: `data:${file.mimetype};base64,${base64Content}`,
      size: file.size,
      filename: filename,
      userId: Array.isArray(fields.userId) ? fields.userId[0] : fields.userId,
      createdAt: new Date().toISOString()
    };

    res.json(mediaItem);
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}