const mysql = require("mysql2")
const dotenv = require('dotenv');

dotenv.config();


const dbConfig = {
    host: "sqlclassdb-instance-1.cqjxl5z5vyvr.us-east-2.rds.amazonaws.com",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: "dangil25",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || "10000")
}

const connection = mysql.createConnection(dbConfig);

module.exports = connection;