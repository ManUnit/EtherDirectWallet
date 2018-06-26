function Setotp() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var qdata_res = JSON.parse(this.responseText);
            if (qdata_res.QRshow) document.getElementById("QRshow").innerHTML = qdata_res.QRshow;
            if (qdata_res.twofa_number_res) document.getElementById("twofa_number_res").innerHTML = qdata_res.twofa_number_res;
            if (qdata_res.twofa_number_res) document.getElementById("profile_info_res").innerHTML = qdata_res.profile_info_res;
            if (qdata_res.ERROR) document.getElementById("ERROR").innerHTML = qdata_res.ERROR;

        }
    };
    var order2fa = document.getElementById("twofaCheck1");
    if (order2fa.checked == true) { resEna2fa = order2fa.value } else { resEna2fa = "null" };
    var otpNum = document.getElementById("otpNum").value;
    document.getElementById("otpNum").value = '';
    xhttp.open("GET", "/otpauth?get=enable" +
        "&enable2fa=" + resEna2fa +
        "&otpNum=" + otpNum,
        true);
    xhttp.send();
}

function GetTwoFA() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var qdata_res = JSON.parse(this.responseText);
            if (qdata_res.QRshow) document.getElementById("QRshow").innerHTML = qdata_res.QRshow; //QRID_id
            if (qdata_res.twofa_number_res) document.getElementById("twofa_number_res").innerHTML = qdata_res.twofa_number_res;
            if (qdata_res.profile_info_res) document.getElementById("profile_info_res").innerHTML = qdata_res.profile_info_res;
            if (qdata_res.ERROR) document.getElementById("ERROR").innerHTML = qdata_res.ERROR;
        }
    };
    var order2fa = document.getElementById("twofaCheck1");

    var resEna2fa = "";
    if (order2fa.checked == true) { resEna2fa = order2fa.value } else { resEna2fa = "null" };
    xhttp.open("GET", "/otpauth?get=order" +
        "&order=" + resEna2fa,
        true);
    xhttp.send();
}