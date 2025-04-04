const mysql = require('mysql');
const connection = mysql.createConnection({
 host: 'localhost',
 user: 'your_username',
 password: 'your_password',
 database: 'your_database'
});
connection.connect((err) => {
 if (err) {
 console.error('Error connecting to the database:', err);
 return;
 }
 console.log('Connected to the database!');
});