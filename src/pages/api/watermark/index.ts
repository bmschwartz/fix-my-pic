import { promises as fsPromises } from 'fs';
import os from 'os';
import path from 'path';
import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  let originalImageFile: formidable.File | undefined = undefined;

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

    const imageMetadata = await sharp(imageFileBuffer).metadata();
    if (!imageMetadata) {
      return res.status(400).send('Invalid image file');
    }

    const watermarkFilePath = path.join(process.cwd(), 'public', 'watermark.png');
    let watermarkFileBuffer: Buffer = await fsPromises.readFile(watermarkFilePath);

    // Get watermark dimensions
    const watermarkMetadata = await sharp(watermarkFileBuffer).metadata();

    // Calculate the scaling factor to maintain aspect ratio if needed
    let scale = 1;

    if (watermarkMetadata.width! > imageMetadata.width! || watermarkMetadata.height! > imageMetadata.height!) {
      const widthScale = imageMetadata.width! / watermarkMetadata.width!;
      const heightScale = imageMetadata.height! / watermarkMetadata.height!;
      scale = Math.min(widthScale, heightScale); // Choose the smaller scale to ensure the watermark fits
    }

    if (scale < 1) {
      // Only resize if the scale is less than 1, meaning the watermark is larger
      watermarkFileBuffer = await sharp(watermarkFileBuffer)
        .resize({
          width: Math.floor(watermarkMetadata.width! * scale),
          height: Math.floor(watermarkMetadata.height! * scale),
          fit: 'cover',
        })
        .toBuffer();
    }

    // Proceed with compositing the watermark on the image
    const watermarkedImage = await sharp(imageFileBuffer)
      .composite([{ input: watermarkFileBuffer, blend: 'over', gravity: 'center', tile: true }])
      .toBuffer();

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${originalImageFile.originalFilename}.png`);
    return res.status(200).send(watermarkedImage);
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
