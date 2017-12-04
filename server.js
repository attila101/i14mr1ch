const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex");
const paypal = require("paypal-rest-sdk");
const request = require("request");
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

	URL='https://api.sandbox.paypal.com/v1/oauth2/token';

	//GETTING THE RICHEST TO CHECK IF CAN EXECUTE PAYMENT
	myNewQuery = sqlDb("donations").first().orderBy('donation','desc');
   	myNewQuery.then(result => {
   		return result;
   	}).then(function(data){


   		//CHECKING IF CAN EXECUTE PAYMENT
		if(req.body.amount > data.Donation){

	   		//CONFIGURE PAYMENY - PAYPAL PHASE 1
			var first_config = {
		    	'mode': 'sandbox',
		    	'client_id': 'AR3tVDwEoIYfSvwQ00Fd8hLxf-8_m_L_6kqYTaOz5LObRwTx4CXcfTpfk_Crm2dU-v1BAPtJAfi0MNe2',
		    	'client_secret': 'ENjpFF8TF_8HntGXa1Ol-ofQiCEU5_xM6rewHl83yerp-wN9Btbqr3VGENl3Q4WFkSOPFLZKSdr5V6ER'
			};

			paypal.configure(first_config);

			console.log("AMOUNT AUTHORIZED = " + req.body.amount);

			//CREATING PAYMENT
			PAYMENT = {
			    "intent": "sale",
			    "payer": {
			        "payment_method": "paypal"
			    },
			    "redirect_urls": {
			        "return_url": "http://return.url",
			        "cancel_url": "http://cancel.url"
			    },
			    "transactions": [{
			        "amount": {
			            "currency": "EUR",
			            "total": req.body.amount
			        },
			        "description": "This is the payment description."
			    }]
			};


			//CREATING PAYMENT AND SENDING IT TO THE CLIENT
			paypal.payment.create(PAYMENT, function (error, payment) {
			    if (error) {
			        throw error;
			    } else {
			        console.log("Create Payment Response");
			        res.send(JSON.stringify(payment));
			    }
			});
		}
	});

});

app.get("/execute-payment", function(req, res){}); //This will be the entry point for after transaction complete */

//Setting server port
const serverPort = 12933;
app.listen(serverPort, function() {
    console.log(`Your app is ready at port ${serverPort}`);
});


