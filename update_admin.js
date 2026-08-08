const mysql = require('mysql2/promise');

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      port: 4000,
      user: 'fayxknEDQC42KGU.root',
      password: 'm5Lg2NdFbJhvoRsi',
      database: 'kings_tv_db',
      ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: false
      }
    });

    // Check if admin exists
    const [rows] = await connection.execute('SELECT id, email, role FROM users WHERE email = ?', ['admin@king24x7.com']);
    console.log("Admin user:", rows);

    // Update role to SUPER_ADMIN
    await connection.execute('UPDATE users SET role = "SUPER_ADMIN", is_active = 1 WHERE email = ?', ['admin@king24x7.com']);
    console.log("Updated to SUPER_ADMIN.");
    
    // Also, we can set the password hash to 'password123' just in case.
    // Hash of 'password123' using spring boot BCrypt
    // We can use a known bcrypt hash for 'password123': $2a$10$R9nE.G3j0K8eK5x4F1PjX.R8p3zT9d.1uJ9z3n3Xo9jT4u9gq7h0e
    // Wait, let's just create a completely new user so we know the password.
    
    await connection.end();
  } catch(e) {
    console.error(e);
  }
}
run();
