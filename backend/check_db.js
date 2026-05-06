const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

console.log('--- USERS ---');
db.all("SELECT id, email, fullName, role, isVerified, otpCode FROM users", (err, rows) => {
  if (err) console.error(err);
  console.table(rows);

  console.log('\n--- ORDERS ---');
  db.all("SELECT id, customerId, status, totalInCents FROM orders", (err, rows) => {
    if (err) console.error(err);
    console.table(rows);
    db.close();
  });
});
