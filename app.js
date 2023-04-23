//set up the server
const DEBUG = true;
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

  const read_all_sql = 
  `SELECT
      e.id, e.name as employee_name, DATE_FORMAT(start_date, "%M %D, %Y") as start_date, salary, location, r.name as rank_name
  FROM
      employee as e
  JOIN 
      rank as r on e.rankid = r.id
  WHERE
      e.userid = ?
  `
  const read_rank_all_sql = 
  `SELECT
      id, name
  FROM 
      rank
  WHERE
      userid = ? or id = -1
  `

  app.get( "/ranks", requiresAuth(), ( req, res ) => {
    db.execute(read_rank_all_sql, [req.oidc.user.email], (error, results) => {
        if (error){
            res.status(500).send(error);
        }else{
            let data = {all: results}
            res.render('ranks', data);
        }
    });
  });
  
  app.get( "/list", requiresAuth(), ( req, res ) => {
      db.execute(read_all_sql, [req.oidc.user.email], (error1, results) => {
          if (error1){
              res.status(500).send(error1);                            
          }else{
              db.execute(read_rank_all_sql, [req.oidc.user.email], (error2, ranks) => {
                  if (error2){
                      res.status(500).send(error2);
                  }else{
                      let data = {all: results, rank: ranks};
                      res.render('list', data);
                  }
              });
          }
      });
  } );

const update_item_sql = `
    UPDATE
        employee
    SET
        name = ?,
        start_date = ?,
        salary = ?,
        location = ?,
        rankid = ?
    WHERE
        id = ?
    AND
        userid = ?

`

app.post("/list/item/:id", ( req, res) => {
    db.execute(update_item_sql, [req.body.name, req.body.start_date, req.body.salary, req.body.location, req.body.rankid, req.params.id, req.oidc.user.email], (error, results) => {
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


const read_item_sql=
    `Select
        e.id as id, e.name as employee_name, DATE_FORMAT(start_date, "%M %D, %Y") as start_date, start_date as unformatted_start_date, salary, location, r.name as rank_name, r.id as rank_id
    From 
        employee as e
    join 
        rank as r on e.rankid = r.id
    Where 
        e.id = ?
    And
        e.userid = ?        
`
app.get( "/list/item/:id", requiresAuth(), ( req, res, next) => {
    db.execute(read_item_sql, [req.params.id, req.oidc.user.email], (error1, results) => {
        if (error1){
            res.status(500).send(error1);                            
        }else if (results.length === 0){
            res.status(404).send(`No item found with id = ${req.params.id}`)
        }else{
            db.execute(read_rank_all_sql, [req.oidc.user.email], (error2, ranks) => {
                if (error2){
                    res.status(500).send(error2);
                }else{
                    let data = {details: results[0], rank: ranks}
                    res.render("item", data);
                }
            })
            
        } 
    })
} );

const delete_item_sql = `
    delete
    from
        employee
    where     
        id = ?
    and
        userid = ?
    `

app.get("/list/item/:id/delete", requiresAuth(), ( req, res) => {
    db.execute(delete_item_sql, [req.params.id, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error);
        else {
            res.redirect("/list");
        }
    });
})

const insert_item_sql = `
    insert into employee
        (name, start_date, salary, location, userid, rankid)
    values
        (?, ?, ?, ?, ?, ?)
    `
app.post("/list", requiresAuth(), ( req, res) => {
    db.execute(insert_item_sql, [req.body.name, req.body.start_date, req.body.salary, req.body.location, req.oidc.user.email, req.body.rankid], (error, results) => {
        if (error)
            res.status(500).send(error);
        else{
            res.redirect(`/list/item/${results.insertId}`);
        }
    });
})

const insert_rank_sql = `
    insert into rank
        (name, id, userid)
    values (?, ?, ?)
`
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );