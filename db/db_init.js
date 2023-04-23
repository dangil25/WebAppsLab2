const db = require("./db_connection");
const drop_employee_table_sql = "DROP TABLE IF EXISTS `employee`"
const drop_rank_table_sql = "DROP TABLE IF EXISTS `rank`"
db.execute(drop_employee_table_sql);
db.execute(drop_rank_table_sql);
const create_employee_table_sql = `
    CREATE TABLE employee (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(45) NOT NULL,
        start_date DATE NULL,
        salary INT NULL,
        location VARCHAR(150) NULL,
        userid VARCHAR(50) NOT NULL,
        rankid INT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (rankid)
            REFERENCES rank (id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
    );
`
const create_rank_table_sql = `
    CREATE TABLE rank (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(45) NOT NULL,
        userid VARCHAR(50) NULL,
        PRIMARY KEY (id));
`
db.execute(create_rank_table_sql);
db.execute(create_employee_table_sql);


db.end();

