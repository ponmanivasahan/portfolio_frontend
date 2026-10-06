import pool from '../../config/db';

const migrate = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Running migrations...');

    // Users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users_portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // About
    await connection.query(`
      CREATE TABLE IF NOT EXISTS about_portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        resume_link VARCHAR(255),
        profile_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Skills
    await connection.query(`
      CREATE TABLE IF NOT EXISTS skills_portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        level INT DEFAULT 0,
        category VARCHAR(100),
        icon VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects_portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        project_url VARCHAR(255),
        github_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Blogs
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blogs_portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        cover_image VARCHAR(255),
        published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Experience
    await connection.query(`
      CREATE TABLE IF NOT EXISTS experience_portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        description TEXT,
        current BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Testimonials
    await connection.query(`
      CREATE TABLE IF NOT EXISTS testimonials_portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_name VARCHAR(100) NOT NULL,
        company VARCHAR(100),
        feedback TEXT NOT NULL,
        rating INT DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Services
    await connection.query(`
      CREATE TABLE IF NOT EXISTS services_portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Messages (Contact Form)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages_portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Media (Gallery / Uploads)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS media_portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    
    // Activity Logs
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activity_logs_portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id INT,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    connection.release();
    console.log('Migrations completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

migrate();
