import pool from '../../config/db';
import bcrypt from 'bcryptjs';

const seed = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Running extended seeds...');

    // Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const [existingAdmin]: any = await connection.query(`SELECT * FROM users_portfolio WHERE email = ?`, [adminEmail]);
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPass, 10);
      await connection.query(
        `INSERT INTO users_portfolio (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [process.env.ADMIN_NAME || 'Admin', adminEmail, hashedPassword, 'admin']
      );
      console.log('Admin user seeded.');
    }

    // Seed About
    const [existingAbout]: any = await connection.query(`SELECT * FROM about_portfolio`);
    if (existingAbout.length === 0) {
      await connection.query(
        `INSERT INTO about_portfolio (title, description) VALUES (?, ?)`,
        ['Senior Full Stack Developer', 'I specialize in building scalable web applications with React and Node.js. Passionate about clean code and great user experiences.']
      );
      console.log('About data seeded.');
    }

    // Seed Skills
    const [existingSkills]: any = await connection.query(`SELECT * FROM skills_portfolio`);
    if (existingSkills.length === 0) {
      const skills = [
        ['React', 90, 'Frontend', 'Code'],
        ['Node.js', 85, 'Backend', 'Server'],
        ['TypeScript', 80, 'Language', 'Type'],
        ['MySQL', 85, 'Database', 'Database']
      ];
      for (const s of skills) {
        await connection.query(`INSERT INTO skills_portfolio (name, level, category, icon) VALUES (?, ?, ?, ?)`, s);
      }
      console.log('Skills data seeded.');
    }

    // Seed Projects
    const [existingProjects]: any = await connection.query(`SELECT * FROM projects_portfolio`);
    if (existingProjects.length === 0) {
      await connection.query(
        `INSERT INTO projects_portfolio (title, description, image_url, project_url, github_url) VALUES (?, ?, ?, ?, ?)`,
        ['E-Commerce Platform', 'Full stack e-commerce solution with cart and checkout.', 'https://images.unsplash.com/photo-1557821552-17105153ce91?w=800&q=80', '#', '#']
      );
      await connection.query(
        `INSERT INTO projects_portfolio (title, description, image_url, project_url, github_url) VALUES (?, ?, ?, ?, ?)`,
        ['Task Management App', 'Drag and drop task management tool for teams.', 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=800&q=80', '#', '#']
      );
      console.log('Projects data seeded.');
    }

    // Seed Services
    const [existingServices]: any = await connection.query(`SELECT * FROM services_portfolio`);
    if (existingServices.length === 0) {
      await connection.query(
        `INSERT INTO services_portfolio (title, description, icon) VALUES (?, ?, ?)`,
        ['Web Development', 'Custom high-performance websites', 'Monitor']
      );
      console.log('Services data seeded.');
    }

    // Seed Blogs
    const [existingBlogs]: any = await connection.query(`SELECT * FROM blogs_portfolio`);
    if (existingBlogs.length === 0) {
      await connection.query(
        `INSERT INTO blogs_portfolio (title, content, cover_image, published) VALUES (?, ?, ?, ?)`,
        ['Getting started with React', 'Full content here...', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80', true]
      );
      console.log('Blogs data seeded.');
    }

    connection.release();
    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
};

seed();
