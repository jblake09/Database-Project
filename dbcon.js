var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_blakejef',
  password        : '****',
  database        : 'cs340_blakejef'
});
module.exports.pool = pool;
