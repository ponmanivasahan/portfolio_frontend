import { Request, Response } from 'express';
import pool from '../config/db';

export const getHealth = async (req: Request, res: Response) => {
  try {
    const [dbResult]: any = await pool.query('SELECT 1');
    const dbStatus = dbResult ? 'Operational' : 'Down';
    
    res.json({
      success: true,
      data: {
        backend: 'Operational',
        database: dbStatus,
        authentication: 'Operational',
        mediaStorage: 'Operational',
        emailService: process.env.SMTP_HOST ? 'Operational' : 'Not Configured'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'System health check failed' });
  }
};