function GetCoins() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
         // var accounts = JSON.parse(this.responseText);
         // document.getElementById("respose_msg").innerHTML = "Your Account ID : " + accounts[0];
         var TX_transection = this.responseText;
         document.getElementById("coins_res").innerHTML = TX_transection ;
     }
 };
    var TXamt = document.getElementById("amount").value ;
    var TXaddr = document.getElementById("address").value;
    var SENDERaddr = document.getElementById("sendaddress").value;
    var SENDERpass = document.getElementById("ULpass").value;

    document.getElementById("SEND_addr_res").innerHTML = "Sender Address : " + SENDERaddr ;
    document.getElementById("TX_Address").innerHTML = "To Address : " + TXaddr ;
    document.getElementById("amount_text").innerHTML = "Amount : " + TXamt ;
    document.getElementById("asset_res").innerHTML = 'Connection Blockchain !!! click again '  ;
    document.getElementById("amount").value = '' ;
    document.getElementById("address").value = '' ;
    document.getElementById("ULpass").value = '' ;

    xhttp.open("GET", "/coinsview?amount="+ TXamt +
                    "&address=" + TXaddr +
                    "&sender=" + SENDERaddr +
                    "&pointer=" + "withdraw" +
                    "&spadd=" + SENDERpass , true);
    xhttp.send();
}

