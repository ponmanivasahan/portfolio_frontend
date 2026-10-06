import { Request, Response } from 'express';
import pool from '../config/db';

export const getItems = (entity: string) => async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${entity}_portfolio ORDER BY created_at DESC`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: `Error fetching ${entity}_portfolio` });
  }
};

export const getItemById = (entity: string) => async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(`SELECT * FROM ${entity}_portfolio WHERE id = ?`, [req.params.id]);
    if (rows.length === 0) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: `Error fetching ${entity}_portfolio` });
  }
};

export const createItem = (entity: string) => async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const keys = Object.keys(body);
    const values = Object.values(body);
    if (keys.length === 0) { res.status(400).json({ message: 'No data provided' }); return; }
    const placeholders = keys.map(() => '?').join(', ');
    const query = `INSERT INTO ${entity}_portfolio (${keys.join(', ')}) VALUES (${placeholders})`;
    const [result]: any = await pool.query(query, values);
    res.status(201).json({ id: result.insertId, ...body });
  } catch (error) {
    res.status(500).json({ message: `Error creating ${entity}_portfolio` });
  }
};

export const updateItem = (entity: string) => async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const keys = Object.keys(body);
    const values = Object.values(body);
    if (keys.length === 0) { res.status(400).json({ message: 'No data provided' }); return; }
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE ${entity}_portfolio SET ${setClause} WHERE id = ?`;
    const [result]: any = await pool.query(query, [...values, req.params.id]);
    if (result.affectedRows === 0) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ id: req.params.id, ...body });
  } catch (error) {
    res.status(500).json({ message: `Error updating ${entity}_portfolio` });
  }
};

export const deleteItem = (entity: string) => async (req: Request, res: Response): Promise<void> => {
  try {
    const [result]: any = await pool.query(`DELETE FROM ${entity}_portfolio WHERE id = ?`, [req.params.id]);
    if (result.affectedRows === 0) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error deleting ${entity}_portfolio` });
  }
};
