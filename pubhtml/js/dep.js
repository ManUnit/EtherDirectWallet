function GetDep() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
         // var accounts = JSON.parse(this.responseText);
         // document.getElementById("respose_msg").innerHTML = "Your Account ID : " + accounts[0];
         var TX_transection = this.responseText;
         document.getElementById("dep_res").innerHTML = TX_transection ;
     }
 };
    xhttp.open("GET", "/depview?get=enable", true);
    xhttp.send();
}

