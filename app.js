//set up the server
const express = require( "express" );
const app = express();
const port = 8080;
const logger = require("morgan");
app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
// define a route for the default home page
app.get( "/", ( req, res ) => {
    console.log("GET /");
    res.sendFile( __dirname + "/views/index.html" );
} );

// define a route for the stuff inventory page
app.get( "/list", ( req, res ) => {
    console.log("GET /list");
    res.sendFile( __dirname + "/views/list.html" );
} );

// define a route for the item detail page
app.get( "/list/item1", ( req, res ) => {
    console.log("GET /list/item1");
    res.sendFile( __dirname + "/views/item1.html" );
} );

app.get( "/list/item2", ( req, res ) => {
    console.log("GET /list/item2");
    res.sendFile( __dirname + "/views/item2.html" );
} );

app.get( "/list/item3", ( req, res ) => {
    console.log("GET /list/item3");
    res.sendFile( __dirname + "/views/item3.html" );
} );

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );