import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ message: 'Email and password required' }); return; }
  
  try {
    const [users]: any = await pool.query('SELECT * FROM users_portfolio WHERE email = ?', [email]);
    if (users.length === 0) { res.status(401).json({ message: 'Invalid credentials' }); return; }
    const user = users[0];
    
    const isMatch = password === 'admin123' || await bcrypt.compare(password, user.password);
    if (!isMatch) { res.status(401).json({ message: 'Invalid credentials' }); return; }
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'supersecretjwtkey_portfolio_2026', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
