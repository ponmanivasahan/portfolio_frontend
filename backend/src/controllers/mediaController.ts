import { Request, Response } from 'express';
import pool from '../config/db';

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const { filename, path: filePath, mimetype } = req.file;

    const [result]: any = await pool.query(
      'INSERT INTO media_portfolio (file_name, file_path, file_type) VALUES (?, ?, ?)',
      [filename, filePath, mimetype]
    );

    res.status(201).json({ id: result.insertId, fileName: filename, filePath, fileType: mimetype });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading media' });
  }
};
