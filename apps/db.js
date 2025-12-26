const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dishant@dishant',
    database: 'log'
});

connection.connect((err) => {
    if (err) {
        console.log('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL as id ' + connection.threadId);
    }
});

//connection.end();

module.exports = connection;