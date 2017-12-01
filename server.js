const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex");
const paypal = require("paypal-rest-sdk");
const $ = require("jQuery");
//Connecting to the .db file
const sqlDb = sqlDbFactory({
    client: "sqlite3",
    debug: true,
    connection: {
        filename: "./richest.db"
    }
});

//Setting directory to tell express where to find public files
app.use(express.static(__dirname + "/public"));

//Register REST entry point
//app.set("port", serverPort);

//Using bodyParser to parse json requests, urlencoded is used for the "post" for the request of info
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//GET THE LATEST RICHEST
app.get("/lastRichs", function(req,res){

});

//GET ALL THE RICH PEOPLE
app.get("/getAllRichs",function(req,res){
	const myQuery = sqlDb("donations");
    myQuery.then(result => {
        res.send(JSON.stringify(result));
    });
});

//GET ONLY THE RICHEST IN ABSOLUTE
app.get("/getRichest", function(req, res) {
   	myNewQuery = sqlDb("donations").first().orderBy('donation','desc');
   	myNewQuery.then(result => {
   		res.send(JSON.stringify(result));
   	});
});

app.post("/newPayment",function(req,res){
	console.log("RECEIVING POST WITH AMOUNT = " + req.body.amount);

	URL='https://api.paypal.com/v1/oauth2/token';
	CLIENT_ID='AR3tVDwEoIYfSvwQ00Fd8hLxf-8_m_L_6kqYTaOz5LObRwTx4CXcfTpfk_Crm2dU-v1BAPtJAfi0MNe2';
	SECRET='ENjpFF8TF_8HntGXa1Ol-ofQiCEU5_xM6rewHl83yerp-wN9Btbqr3VGENl3Q4WFkSOPFLZKSdr5V6ER';


	//GETTING THE RICHEST TO CHECK IF CAN EXECUTE PAYMENT
	myNewQuery = sqlDb("donations").first().orderBy('donation','desc');
   	myNewQuery.then(result => {
   		return result;
   	}).then(function(data){

   		//CHECKING IF CAN EXECUTE PAYMENT
		if(req.body.amount > data.Donation){
			console.log("AMOUNT AUTHORIZED = " + data.Donation);

			//INITIALIZING CLIENT DATA TO RETRIEVE PAYMENT TOKEN FROM PAYPAL 
			var user = CLIENT_ID + ":" + SECRET;
			var get_token_json = JSON.stringify({ 
				"user":  user ,
			 	"data" : "grant_type=client_credentials"
			});

			var response_json;

			//GETTING PAYPAL AUTHORIZATION WITH TOKEN 			
			$.ajax({
			 	type: "POST",
			  	url: URL,
			  	data : get_token_json,
			  	success: function(response){
			  		response_json = response;
			  		console.log("FIRST POST TO PAYPAL SUCCESS WITH RESPONSE = " + response);
				}
			}); 

			console.log("DONE POST TO PAYPAL AND RETRIEVED AUTHORIZATION = " + response_json);

			//CREATING DATA TO EXECUTE PAYMENT
			URLPAY='https://api.paypal.com/v1/payments/payment';
			ACCESS_TOKEN = response_json.access_token;

			//CREATING PAYMENT
			PAYMENT = JSON.stringify({
		  		"intent": "sale",
		  		"redirect_urls": {
		    	"return_url": "...",
		    	"cancel_url": "..."
		  		},
		  		"payer": {
		    		"payment_method":"paypal"
		  		},
		  		"transactions": [
		    		{
		      			"amount":{
		        		"total":req.body.amount,
		        		"currency":"EUR"
		      			}
		    		}
		  		]
			});
			
			$.ajax({
			 	type: "POST",
			  	url: URLPAY,
			  	data : PAYMENT,
			  	success: function(response){
			  		console.log("DONE SECOND POST WITH RESPONSE " + response);
				}
			});
			//MO DOVREMMO RITORNARE TUTTO E SPEDIRLO AL CLIENT
		}
	});

});

app.get("/execute-payment", function(req, res){}); //This will be the entry point for after transaction complete */

//Setting server port
const serverPort = 12933;
app.listen(serverPort, function() {
    console.log(`Your app is ready at port ${serverPort}`);
});


