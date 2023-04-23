const db = require("./db_connection");

/**** Delete *CONTENTS OF* existing tables (but not dropping tables themselves) ****/

const delete_employee_table_sql = "DELETE FROM employee;"

db.execute(delete_employee_table_sql);

const delete_rank_table_sql = "DELETE FROM rank;"

db.execute(delete_rank_table_sql);

/**** Create some sample subjects and assignments ****/

const insert_rank_sql = `
    INSERT INTO rank
        (id, name, userid) 
    VALUES 
        (?, ?, ?);
`
db.execute(insert_rank_sql, [-1, 'None', null])
db.execute(insert_rank_sql, [1, 'A', 'dangil25@bergen.org']);

db.execute(insert_rank_sql, [2, 'B', 'dangil25@bergen.org']);

db.execute(insert_rank_sql, [3, 'C', 'dangil25@bergen.org']);

db.execute(insert_rank_sql, [4, 'D', 'dangil25@bergen.org']);


const insert_employee_sql = `
    INSERT INTO employee
        (name, start_date, salary, location, userid, rankid) 
    VALUES 
        (?, ?, ?, ?, ?, ?);
`

db.execute(insert_employee_sql, ["John Adams", '2023-05-26', 10000, "New York", 'dangil25@bergen.org', 1]);

db.execute(insert_employee_sql, ['Alice', '2022-05-21', 30000, "Florida", 'dangil25@bergen.org', 4]);

db.execute(insert_employee_sql, ['Bob', '1002-05-26', 5000, "California", 'dangil25@bergen.org', 3]);



db.end();