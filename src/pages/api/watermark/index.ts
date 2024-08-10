import { promises as fsPromises } from 'fs';
import os from 'os';
import formidable, { File } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { addImageWatermark } from 'sharp-watermark';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  let originalImageFile: File | undefined = undefined;

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10 MB size limit
      keepExtensions: true,
      multiples: false,
      uploadDir: os.tmpdir(), // Directory for storing temporary files
    });

    const { files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    if (!files.file) {
      return res.status(400).send('File not found');
    }

    // Ensure files.file is treated as a single File instance
    originalImageFile = Array.isArray(files.file) ? files.file[0] : (files.file as formidable.File);

    if (!originalImageFile) {
      return res.status(400).send('File not found');
    }

    // Read the file into a buffer
    const imageFileBuffer = await fsPromises.readFile(originalImageFile.filepath);
    const watermarkFileBuffer = await fsPromises.readFile('public/watermark.png');

    const watermarkedImage = await addImageWatermark(imageFileBuffer, watermarkFileBuffer, {
      dpi: 600,
      ratio: 1,
      opacity: 0.5,
    });

    const watermarkBuffer: Buffer = await watermarkedImage.toBuffer();

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${originalImageFile.originalFilename}.png`);
    return res.status(200).send(watermarkBuffer);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  } finally {
    // Clean up temporary files
    if (originalImageFile?.filepath) {
      await fsPromises.unlink(originalImageFile.filepath);
    }
  }
};

export default handler;
