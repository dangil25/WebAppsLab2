//set up the server
const db = require("./db/db_connection");
const express = require( "express" );
const app = express();
const port = 8080;
const dotenv = require('dotenv');
const { requiresAuth } = require('express-openid-connect');


dotenv.config();
const logger = require("morgan");
const { auth } = require('express-openid-connect');
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
  };
  
  // auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")
app.use( express.urlencoded({ extended: false }) );

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.oidc.isAuthenticated();
    res.locals.user = req.oidc.user;
    next();
})
app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });

app.get('/authtest', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });



const read_stuff_all_sql = 
`SELECT
    id, name, arrival, a_date, d_date, locations
FROM
    stuff
WHERE
    userid = ?
`


const read_item_sql=
    `Select
        id, name, arrival, a_date, d_date, locations
    From 
        stuff
    Where 
        id = ?
    And
        userid = ?        
`

const delete_item_sql = `
    delete
    from
        stuff
    where     
        id = ?
    and
        userid = ?
    `

const insert_item_sql = `
    insert into stuff
        (name, arrival, a_date, d_date, userid)
    values
        (?, ?, ?, ?, ?)
    `

const update_item_sql = `
    UPDATE
        stuff
    SET
        name = ?,
        arrival = ?,
        a_date = ?,
        d_date = ?,
        locations = ?
    WHERE
        id = ?
    AND
        userid = ?

`

app.post("/list/item/:id", ( req, res) => {
    db.execute(update_item_sql, [req.body.name, req.body.arrival, req.body.a_date, req.body.d_date, req.body.locations, req.params.id, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error);
        else {
            res.redirect(`/list/item/${req.params.id}`);
        }
    });
})

app.get( "/", requiresAuth(), ( req, res ) => {
    console.log("GET /");
    res.render("index");
} );

app.get( "/list", requiresAuth(), ( req, res ) => {
    db.execute(read_stuff_all_sql, [req.oidc.user.email], (error, results) => {
        if (error){
            res.status(500).send(error);                            
        }else{
            res.render('list', {inventory : results});
        }
    });
    
} );

// define a route for the item  detail page
app.get( "/list/item/:id", requiresAuth(), ( req, res, next) => {
    db.execute(read_item_sql, [req.params.id, req.oidc.user.email], (error, results) => {
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

app.get("/list/item/:id/delete", requiresAuth(), ( req, res) => {
    db.execute(delete_item_sql, [req.params.id, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error);
        else {
            res.redirect("/list");
        }
    });
})

app.post("/list", requiresAuth(), ( req, res) => {
    db.execute(insert_item_sql, [req.body.name, req.body.arrival, req.body.sdate, req.body.edate, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error);
        else{
            res.redirect(`/list/item/${results.insertId}`);
        }
    });
})

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );