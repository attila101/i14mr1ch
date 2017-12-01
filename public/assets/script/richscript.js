function loadRichPerson() {
    fetch("../getRichest").then(function(response) {
        return (response.json());
    }).then(function(data) {
        document.getElementById("introduction_phrase").innerHTML =

            '<p class="richest"> THE RICHEST </p>' +

            data.Username + ' <div class="top_header_people">'

            +
            'paid <p class="payment">' + data.Donation + '€</p> saying <p class="payment">"' + data.Description + '"</p> <p>ARE YOU RICHER?</p></div>';
    });
}

function loadLastRichest() {
    fetch("../getRichest").then(function(response) {
        return (response.json());
    }).then(function(data) {
        var first = data[0];
        var second = data[1];
        var third = data[2];
        document.getElementById("tablebody").innerHTML =
            '<tr> <th scope="row">1</th><td>' + first.Username + '</td><td>' + first.Donation + '</td><td>' + first.Description + '</td></tr> ' +
            '<tr> <th scope="row">2</th><td>' + second.Username + '</td><td>' + second.Donation + '</td><td>' + second.Description + '</td></tr> ' +
            '<tr> <th scope="row">3</th><td>' + third.Username + '</td><td>' + third.Donation + '</td><td>' + third.Description + '</td></tr> ';
    });
}


var timeFade = 300;

function destroy(element) {
    $("#" + element).fadeOut(timeFade);
}

function loadHomePage() {
    $("#homepage").delay(timeFade).fadeIn(timeFade);
}

function areyousure(todelete) {
    destroy(todelete);
    $("#areyousure").delay(timeFade).fadeIn(timeFade);
}

function iamrich(todelete) {
    destroy(todelete);
    loadRichPerson();
    $("#iamrich").delay(timeFade).fadeIn(timeFade);
}

function theyare(todelete) {
    destroy(todelete);
    loadLastRichest();
    $("#theyare").delay(timeFade).fadeIn(timeFade);
}

function okyouarepoor(todelete) {
    destroy(todelete);
    $("#okyouarepoor").delay(timeFade).fadeIn(timeFade);
}

var richest_amount;
var description;
var nickname;
var amount_tot;


function payment(todelete) {
    destroy(todelete);
    $("#pay").delay(timeFade).fadeIn(timeFade);
    paypal.Button.render({
        /*
        env: 'sandbox', 

        client: {
            sandbox:    'AR3tVDwEoIYfSvwQ00Fd8hLxf-8_m_L_6kqYTaOz5LObRwTx4CXcfTpfk_Crm2dU-v1BAPtJAfi0MNe2',
            production: 'ATDvCZlE_JEUjw7tlwP-CZ5zlQ4P592fc2pLRK3_PmPVuFhaa0x6HCHNmFAuQ8LKfAB7as9nMxSunwGt'
        },
        */

        commit: true, 
        style: {
            size: 'medium',
            color: 'gold',
            shape: 'pill',
            label: 'checkout'
        },
        locale: 'en_US',
        payment: function() {
            nickname = $("#nickname").val();
            amount = $("#amount").val();
            description = $("#description").val();
            data = {
                "nickname" : nickname,
                "amount" : amount,
                "description" : description
            };
            return new paypal.Promise(function(resolve, reject) {

                // Call your server side to get the Payment ID from step 3, then pass it to the resolve callback
                jQuery.post("/newPayment", data).done(function(data){
                    console.log("HEI I GOT THE PAYMENT JSON = " + data);
                    jQuery.post('https://www.my-paypal-store.com/my-api/payment-create')
                    .done(function(data) {
                        resolve(data.paymentID);
                    });
                });
            });
        },

        onAuthorize: function(data, actions) {
            return actions.payment.execute();
        },
        onError: function(data, actions){
            console.log("ERRORRRRRR");
            $("#warning").show();
        }

    }, '#paypal-button');

    function callPayment(data){
    
        if(data.amount > data.oldAmount){
            $.ajax({
              type: "POST",
              url: "/newPayment",
              data: data,
              success: function(){
                console.log("POST SUCCESSFUL");
                return true;
                }
            });
            console.log("POST DONE");
            return false;
        }
    }
    
}
