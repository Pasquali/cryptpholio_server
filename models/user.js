var db = require('../config/dbconnection');
var crypto = require('crypto');
const mysql = require('mysql');

exports.allUsers = function(next) {
    db.query('SELECT * FROM people', function(err, result) {
        if (err) throw err;
        next(result);
    });
};
exports.singleUser = function(userName, next) {
    db.query('SELECT * FROM people WHERE name = ?', userName, function(err, result) {
        if (err) throw err;
        next(result);
    });
}