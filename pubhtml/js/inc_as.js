function GetAsset() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var jdata_res = JSON.parse(this.responseText);
         document.getElementById("asset_res").innerHTML = jdata_res.res_div  ;
         document.getElementById("asset_err").innerHTML = jdata_res.ERROR  ;
         document.getElementById("asset_addr").value = jdata_res.asset_Address  ;
         document.getElementById("asset_contract").value = jdata_res.asset_contract  ;
      }
    };
    var txAddress = document.getElementById("asset_addr").value;
    var accountParse = document.getElementById("ULpass").value;
    document.getElementById("token_asset_res").innerHTML = ''  ;
    document.getElementById("asset_res").innerHTML = 'Connection Blockchain !!! click again '  ;
    xhttp.open("GET", "/assetview?get=enable" , true);
    xhttp.send();
}

function SendAsset() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          var jdata_res = JSON.parse(this.responseText);
         //document.getElementById("asset_res").innerHTML = jdata_res.res_div  ;
         document.getElementById("asset_err").innerHTML = jdata_res.ERROR  ;
         document.getElementById("token_asset_res").innerHTML = jdata_res.send_div  ;
         document.getElementById("transac_asset_res").innerHTML = jdata_res.transac_asset_res  ;
      }
    };
    var txAddress = document.getElementById("asset_addr").value;
    var rxAddress = document.getElementById("assetReceiver").value;
    var asset_contract = document.getElementById("asset_contract").value;
    var assetAmount = document.getElementById("assetAmount").value;
    var accountParse = document.getElementById("accountParse").value;
    document.getElementById("assetReceiver").value = '' ;
    document.getElementById("assetAmount").value = '' ;
    document.getElementById("accountParse").value = '' ;
    // Clear Response 	
    document.getElementById("asset_err").innerHTML = ''  ;
    document.getElementById("token_asset_res").innerHTML = ''  ;
    document.getElementById("transac_asset_res").innerHTML = ' your transaction is in process please wait around 2 minute at least '  ;

    // document.getElementById("asset_res").innerHTML = 'Connection Blockchain !!! click again '  ;
    xhttp.open("GET", "/sendasset?SenderAddress=" + txAddress +
                    "&asset_contract=" + asset_contract +
                    "&receiverAddress=" + rxAddress +
                    "&assetAmount=" +  assetAmount +
                    "&pointer=" + "sendasset" +
                    "&sparse=" + accountParse , true);
    xhttp.send();
} // 

