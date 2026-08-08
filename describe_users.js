const mysql = require('mysql2/promise');

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      port: 4000,
      user: 'fayxknEDQC42KGU.root',
      password: 'm5Lg2NdFbJhvoRsi',
      database: 'kings_tv_db',
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false }
    });

    const [rows] = await connection.execute('DESCRIBE users;');
    console.log(rows);
    
    // Also let's just make admin@king24x7.com a SUPER_ADMIN unconditionally
    await connection.execute('UPDATE users SET role = "SUPER_ADMIN", is_active = 1 WHERE email = "admin@king24x7.com"');
    console.log("Updated to SUPER_ADMIN.");
    
    await connection.end();
  } catch(e) {
    console.error(e);
  }
}
run();
