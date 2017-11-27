const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex");
const paypal = require("paypal-rest-sdk");
//Connecting to the .db file
const sqlDb = sqlDbFactory({
    client: "sqlite3",
    debug: true,
    connection: {
        filename: "./richest.db"
    }
});




//Using bodyParser to parse json requests, urlencoded is used for the "post" for the request of info
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//Setting server port
let serverPort = process.env.PORT || 443;
//Setting directory to tell express where to find public files
app.use(express.static(__dirname + "/public"));

//Register REST entry point
app.set("port", serverPort);

// Start the server on port 5000 
app.listen(serverPort, function() {
    console.log(`Your app is ready at port ${serverPort}`);
});

app.get("/getRichest", function(req, res) {
    let myQuery = sqlDb("donations");
    myQuery.then(result => {
        res.send(JSON.stringify(result));
    });
});

app.post("/newPayment",function(req,res){
	console.log("RECEIVING POST " + req.body);
	//STORE IN DB DATA AND SEND RESPONSE
});

app.get("/execute-payment", function(req, res){}); //This will be the entry point for after transaction complete */