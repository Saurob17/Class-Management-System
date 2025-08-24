// MariaDB connection using mariadb package
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'class_management_db',
  connectionLimit: 5
});

module.exports = pool;
