const db = require("./db_connection");
const drop_stuff_table_sql = "DROP TABLE IF EXISTS `stuff`"
const drop_category_table_sql = "DROP TABLE IF EXISTS `category`"
db.execute(drop_stuff_table_sql);
db.execute(drop_category_table_sql);
const create_stuff_table_sql = `
    CREATE TABLE stuff (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(45) NOT NULL,
        arrival VARCHAR(45) NULL,
        a_date DATE NULL,
        d_date DATE NULL,
        locations VARCHAR(150) NULL,
        userid VARCHAR(50) NULL,
        categoryid INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (categoryid)
            REFERENCES category (id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
    );
`
const create_category_table_sql = `
    CREATE TABLE category (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(45) NOT NULL,
        userid VARCHAR(50) NULL,
        PRIMARY KEY (id)
    );
`
db.execute(create_category_table_sql);
db.execute(create_stuff_table_sql);


db.end();

