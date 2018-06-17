function GetAsset() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var jdata_res = JSON.parse(this.responseText);
         // document.getElementById("respose_msg").innerHTML = "Your Account ID : " + accounts[0];
         //var TX_transection = this.responseText;
         document.getElementById("asset_res").innerHTML = jdata_res.res_div  ;
         document.getElementById("asset_err").innerHTML = jdata_res.ERROR  ;
         document.getElementById("asset_addr").value = jdata_res.asset_Address  ;
     }
 };
  //  var TXamt = document.getElementById("amount").value ;
    var txAddress = document.getElementById("asset_addr").value;
  //  var SENDERaddr = document.getElementById("sendaddress").value;
    var toParse = document.getElementById("ULpass").value;

    //document.getElementById("SEND_addr_res").innerHTML = "Sender Address : " + SENDERaddr ;
    //document.getElementById("TX_Address").innerHTML = "To Address : " + txAddress ;
    //document.getElementById("amount_text").innerHTML = "Amount : " + TXamt ;
    document.getElementById("asset_res").innerHTML = 'Connection Blockchain !!! click again '  ;
    //document.getElementById("amount").value = '' ;
    //document.getElementById("address").value = '' ;
    //document.getElementById("ULpass").value = '' ;

    xhttp.open("GET", "/assetview?address=" + txAddress +
                    "&pointer=" + "assetview" +
                    "&sparse=" + toParse , true);
                    // "&sender=" + SENDERaddr +
    xhttp.send();
}

