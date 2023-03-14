const db = require("./db_connection");
const drop_stuff_table_sql = "DROP TABLE IF EXISTS `stuff`;"

db.execute(drop_stuff_table_sql);

const create_stuff_table_sql = `
    CREATE TABLE stuff (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(45) NOT NULL,
        arrival VARCHAR(45) NULL,
        a_date DATE NULL,
        d_date DATE NULL,
        locations VARCHAR(150) NULL,
        userid VARCHAR(50) NULL,
        PRIMARY KEY (id)
    );
`
db.execute(create_stuff_table_sql);

const insert_stuff_table_sql = `
    INSERT INTO stuff 
        (name, arrival, a_date, d_date, locations) 
    VALUES 
        (?, ?, ?, ?, ?);
`
db.execute(insert_stuff_table_sql, ['Canada, February Break', 'Quebec', '2023-02-14', '2023-02-23', 'Montreal, Lake Eire']);

db.execute(insert_stuff_table_sql, ['France, Summer', 'Paris', '2023-06-24', '2023-07-12', 'Eifel Tower, Louvre, Bastogne']);

db.execute(insert_stuff_table_sql, ['Mexico, Thanksgiving Break', 'Cancun', '2023-11-23', '2023-11-29', 'Ixmiquilpan, Cenote']);

db.execute(insert_stuff_table_sql, ['Chile, Winter Break', 'Santiago', '2023-12-23', '2024-01-02', '']);


const read_stuff_table_sql = "SELECT * FROM stuff";

db.execute(read_stuff_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'stuff' initialized with:")
        console.log(results);
    }
);

db.end();

