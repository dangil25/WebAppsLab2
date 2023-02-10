//set up the server
const db = require("./db/db_connection");
const express = require( "express" );
const app = express();
const port = 8080;
const logger = require("morgan");

app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")

const read_stuff_all_sql = 
`Select
    id, name, arrival, a_date, d_date, locations
From stuff`

const read_item_sql=
    `Select
        name, arrival, a_date, d_date, locations
    From 
        stuff
    Where 
        stuff.id = ?`
// define a route for the default home page

app.get( "/", ( req, res ) => {
    console.log("GET /");
    res.render("index");
} );

// define a route for the stuff inventory page
app.get( "/list", ( req, res ) => {
    db.execute(read_stuff_all_sql, (error, results) => {
        if (error){
            res.status(500).send(error);                            
        }else{
            res.render('list', {inventory : results});
        }
    });
    
} );

// define a route for the item  detail page
app.get( "/list/item/:id", ( req, res, next) => {
    db.execute(read_item_sql, [req.params.id], (error, results) => {
        if (error){
            res.status(500).send(error);                            
        }else if (results.length === 0){
            res.status(404).send(`No item found with id = ${req.params.id}`)
        }else{
            let data = results[0]
            res.render("item", data);
        }
    })
} );


// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );