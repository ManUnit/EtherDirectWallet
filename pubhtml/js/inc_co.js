function GetCoins() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
         // var accounts = JSON.parse(this.responseText);
         // document.getElementById("respose_msg").innerHTML = "Your Account ID : " + accounts[0];
	           var jdata_res = this.responseText;
	             var obj = JSON.parse(jdata_res) ;
	             document.getElementById("coins_res").innerHTML = obj.res_div   ;
	             document.getElementById("coins_err").innerHTML = obj.ERROR   ;
	             document.getElementById("coins_addr").value = obj.coin_address ;
     }
 };
   // var TXamt = document.getElementById("amount").value ; 
    var senderAddress = document.getElementById("coins_addr").value;
    var SENDERpass = document.getElementById("ULpass").value;


  //  document.getElementById("amount_text").innerHTML = "Amount : " + TXamt ;
    document.getElementById("asset_res").innerHTML = 'Connection Blockchain !!! click again '  ;
    document.getElementById("amount").value = '' ;
/*
    xhttp.open("GET", "/coinsview?amount="+ TXamt +
                    "&address=" + senderAddress +
                    "&sendparse=" + SENDERpass , true);
    xhttp.send();
*/
    xhttp.open("GET", "/coinsview?get=enable" , true);
    xhttp.send();
} //

function SendCoins() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
         // var accounts = JSON.parse(this.responseText);
         // document.getElementById("respose_msg").innerHTML = "Your Account ID : " + accounts[0];
	         var jdata_res = this.responseText;
	         var obj = JSON.parse(jdata_res) ;
	    //     document.getElementById("coins_res").innerHTML = obj.res_div   ;
	    //     document.getElementById("coins_err").innerHTML = obj.ERROR   ;
	         document.getElementById("co_addr_res").innerHTML = obj.co_addr_res   ;
	    //     document.getElementById("coins_addr").value = obj.coin_address ;
     }
 };
    var TXamt = document.getElementById("amount").value ; 
    var senderAddress = document.getElementById("coins_addr").value;
    var receiverAddress = document.getElementById("receiverAddress").value;
    var SENDERpass = document.getElementById("ULpass").value;
    var coInput2FA = document.getElementById("coInput2FA").value ; 

    document.getElementById("amount_text").innerHTML = "Send to : " + receiverAddress + " Amount : " + TXamt  ;
    document.getElementById("asset_res").innerHTML = 'Connection Blockchain !!! click again '  ;
    document.getElementById("amount").value = '' ;
    document.getElementById("receiverAddress").value = '' ;
    document.getElementById("ULpass").value = '' ;
    document.getElementById("coInput2FA").value = '' ; 
    document.getElementById("co_addr_res").innerHTML = 'your transaction is in process please wait around 2 minute at least ' ;

    xhttp.open("GET", "/dextransfer?amount="+ TXamt +
                    "&senderAddress=" + senderAddress +
                    "&pointer=coinsview"  +  
                    "&coInput2FA=" + coInput2FA + 
                    "&receiverAddress=" + receiverAddress +
                    "&sendparse=" + SENDERpass , true);
    xhttp.send();
} //

