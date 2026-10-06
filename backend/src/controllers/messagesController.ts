import { Request, Response } from 'express';
import pool from '../config/db';
import nodemailer from 'nodemailer';

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      res.status(400).json({ message: 'Name, email, and message are required' });
      return;
    }

    // Insert into DB
    const [result]: any = await pool.query(
      'INSERT INTO messages_portfolio (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: 'admin@portfolio.local', // Admin email
      subject: `New Portfolio Message from ${name}: ${subject}`,
      text: message
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error('Nodemailer error (ignoring):', mailError);
    }

    res.status(201).json({ id: result.insertId, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};
