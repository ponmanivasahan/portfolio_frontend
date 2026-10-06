import { Request, Response } from 'express';
import pool from '../config/db';

export const getOverview = async (req: Request, res: Response) => {
  try {
    const [projects]: any = await pool.query('SELECT COUNT(*) as total, SUM(CASE WHEN project_url IS NOT NULL THEN 1 ELSE 0 END) as featured FROM projects_portfolio');
    const [blogs]: any = await pool.query('SELECT COUNT(*) as total, SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published, SUM(CASE WHEN published = 0 THEN 1 ELSE 0 END) as drafts FROM blogs_portfolio');
    const [skills]: any = await pool.query('SELECT COUNT(*) as total FROM skills_portfolio');
    const [experience]: any = await pool.query('SELECT COUNT(*) as total FROM experience_portfolio');
    const [testimonials]: any = await pool.query('SELECT COUNT(*) as total FROM testimonials_portfolio');
    const [services]: any = await pool.query('SELECT COUNT(*) as total FROM services_portfolio');
    const [messages]: any = await pool.query('SELECT COUNT(*) as total, SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread FROM messages_portfolio');
    const [media]: any = await pool.query('SELECT COUNT(*) as total FROM media_portfolio');

    res.json({
      success: true,
      data: {
        projects: { total: projects[0].total || 0, featured: projects[0].featured || 0 },
        blogs: { total: blogs[0].total || 0, published: blogs[0].published || 0, drafts: blogs[0].drafts || 0 },
        skills: { total: skills[0].total || 0 },
        experience: { total: experience[0].total || 0 },
        testimonials: { total: testimonials[0].total || 0 },
        services: { total: services[0].total || 0 },
        messages: { total: messages[0].total || 0, unread: messages[0].unread || 0 },
        media: { total: media[0].total || 0 }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getActivity = async (req: Request, res: Response) => {
  try {
    const [activities]: any = await pool.query('SELECT * FROM activity_logs_portfolio ORDER BY created_at DESC LIMIT 20');
    res.json({ success: true, data: activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
