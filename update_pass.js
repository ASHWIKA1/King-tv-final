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

    // Hash for 'password123'
    const hash = "$2a$10$8.UnVuG9HLROJgTr1TDo8.Taraq27.q.Y7SOrwLqX3qL6y9bM6G/i"; 
    await connection.execute('UPDATE users SET password = ? WHERE email = "admin@king24x7.com"', [hash]);
    console.log("Updated password.");
    
    await connection.end();
  } catch(e) {
    console.error(e);
  }
}
run();
