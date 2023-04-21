const db = require("./db_connection");

/**** Delete *CONTENTS OF* existing tables (but not dropping tables themselves) ****/

const delete_stuff_table_sql = "DELETE FROM stuff;"

db.execute(delete_stuff_table_sql);

const delete_category_table_sql = "DELETE FROM category;"

db.execute(delete_category_table_sql);

/**** Create some sample subjects and assignments ****/

const insert_category_sql = `
    INSERT INTO category
        (id, name, userid) 
    VALUES 
        (?, ?, ?);
`

db.execute(insert_category_sql, [1, 'A', 'dangil25@bergen.org']);

db.execute(insert_category_sql, [2, 'B', 'dangil25@bergen.org']);

db.execute(insert_category_sql, [3, 'Language', 'dangil25@bergen.org']);

db.execute(insert_category_sql, [4, 'Music', 'dangil25@bergen.org']);


const insert_trip_sql = `
    INSERT INTO assignments 
        (name, arrival, subjectId, dueDate, description) 
    VALUES 
        (?, ?, ?, ?, ? );
`

//subjectId: 2 => 'Math'
db.execute(insert_assignment_sql, ['Textbook Exercises', 10, 2, '2023-05-26', 
        'Do odd questions in the range #155 - #207 (chapter 11). Remember to show your work!']);

//subjectId: 3 => 'Language'
db.execute(insert_assignment_sql, ['Long Form Essay', 8, 3, '2023-06-01', null]);

//subjectId: 1 => 'Comp Sci'
db.execute(insert_assignment_sql, ['Web App Project', 5, 1, '2023-06-07', null]);

/**** Create some additional subjects and assignments that aren't in the prototypes ****/

db.execute(insert_subject_sql, [5, 'Biology']);

db.execute(insert_subject_sql, [6, 'History']);

//subjectId: 1 => 'Comp Sci'
db.execute(insert_assignment_sql, ['Recursion Lab', 7, 1, '2023-05-23', 'Partner optional']);

//subjectId: 4 => 'Music'
db.execute(insert_assignment_sql, ['Practice!', 1, 4, null, 'Every day :)']);

//subjectId: 5 => 'Biology'
db.execute(insert_assignment_sql, ['Cell Function Research Paper', null, 5, '2023-06-06', null]);

//subjectId: 6 => 'History'
db.execute(insert_assignment_sql, ['Watch WWII docuseries on PBS', null, 6, null, 'Technically optional, but actually looks interesting']);

db.end();