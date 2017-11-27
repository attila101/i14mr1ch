function loadRichPerson() {
    fetch("../getRichest").then(function(response) {
        return (response.json());
    }).then(function(data) {
        document.getElementById("introduction_phrase").innerHTML =

            '<p class="richest"> THE RICHEST </p>' +

            data[0].Username + ' <div class="top_header_people">'

            +
            'paid <p class="payment">' + data[0].Donation + '€</p> saying <p class="payment">"' + data[0].Description + '"</p> <p>ARE YOU RICHER?</p></div>';
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
        env: 'sandbox', 

        client: {
            sandbox:    'AR3tVDwEoIYfSvwQ00Fd8hLxf-8_m_L_6kqYTaOz5LObRwTx4CXcfTpfk_Crm2dU-v1BAPtJAfi0MNe2',
            production: 'ATDvCZlE_JEUjw7tlwP-CZ5zlQ4P592fc2pLRK3_PmPVuFhaa0x6HCHNmFAuQ8LKfAB7as9nMxSunwGt'
        },

        commit: true, 
        style: {
            size: 'medium',
            color: 'gold',
            shape: 'pill',
            label: 'checkout'
        },
        locale: 'en_US',

        payment: function(data, actions) {
            return  fetch("/getRichest").then(function(res){
                return (res.json());
            }).then(function(data){

                richest_amount = data[0].Donation;
                amount_tot = $("#amount").val();
                description = $("#description").val();
                nickname = $("#nickname");

                var payment_json = {
                        transactions: [
                            {
                                amount: {
                                    total:    amount_tot,
                                    currency: 'EUR'
                                }
                            }
                        ]
                    };
                if(amount_tot > richest_amount){
                    console.log("EXECUTING PAYPAL REQUEST");
                    return actions.payment.create(payment_json);
                } else {
                    console.log("Amount too low to execute transaction");
                }

            });
        },

        onAuthorize: function(data, actions) {
            return actions.payment.execute().then(function(payment) {
                if(payment.transactions[0].amount.total == amount_tot){
                    console.log("AUTHORIZED");
                    var post_json = {
                        "nickname" = nickname,
                        "description" = description,
                        "amount" = payment.transactions[0].amount.total
                    }
                    $.ajax({
                      type: "POST",
                      url: "/newPayment",
                      data: post_json,
                      success: function(){
                        console.log("POST SUCCESSFUL");
                        //SHOW A NICE PAGE
                        }
                    });
                }
            });
        },
        onError: function(data, actions){
            console.log("ERRORRRRRR");
            $("#warning").show();
        }

    }, '#paypal-button');
    
}
