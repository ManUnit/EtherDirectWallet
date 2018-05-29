//var Serv = require('./webservice')  // Request npm module
 var config = require('./config.json');
 var port = 2000 ;
 var express = require('express')  // Request npm module
 var Web3 = require('web3');  // request installed npm or yarn module
 var webserver = express() ;
 var bodyParser = require('body-parser') ;  // Get Post data
 var web3 = new Web3("http://" + config.RPCSVR + ":" + config.RPCPORT ) ;
 var sleep = require('sleep');
 webserver.use( bodyParser.urlencoded({extended: true}) ) ;

console.log( "use Main AC: " + config.MainAc ) 
var mongoose = require('mongoose') ;
var DBuser = config.mongoDB.user  ;
var DBpassword = config.mongoDB.password 
var options = { server: { socketOptions: { keepAlive: 1 } } };


console.log("Use RPC server]:" + config.RPCSVR + ":" + config.RPCPORT ) ;
console.log("open web  http://[ip-web-server]:" + port) ;
console.log("CTRL+C to Exit") ;
// console.log(Web3.providers) ;
web3.eth.getAccounts(function(err, res){
    console.log(err, res) 
 }
) 

   webserver.get('/',(req, res) => {
     res.sendFile(__dirname + '/pubhtml/index.html');
     // console.log(__dirname);
   })

   webserver.get('/tokens',(req, res) => {
     res.sendFile(__dirname + '/pubhtml/smt.html');
     // console.log(__dirname);
   })

   webserver.get('/wallet',(req , res) => {
         var token_amount = req.params.amount ;
         var sender_address = req.params.sender ;
         var sender_pass = req.params.spadd ;
         var rx_address = req.params.address ;
         console.log( '' + token_amount);

     })


   webserver.get('/api', function(req, res) {
	  var user_id = req.param('id');
	  var token = req.param('token');
	  var geo = req.param('geo');  

	  res.send(user_id + ' ' + token + ' ' + geo);
       } );

webserver.get('/dextransfer',(req, WEBres) => {
var tx_amonut  = req.query.amount ; 
var rx_address = req.query.address.trim()  ;
var sender_address = req.query.sender.trim()  ;
var sender_pass = req.query.spadd  ;
 var TX_ac = sender_address ;
 var VALUE_ETH = tx_amonut;  
 var TX_WEI  = VALUE_ETH *  Math.pow(10, 18)  ;
 var TX_pass = sender_pass; 
 var ADD_CHK_RES = '' ;

 console.log ( "  CHECK Valid address : " + web3.utils.isAddress( rx_address  )  );

 if ( !web3.utils.isAddress( sender_address  ) ) {   // GATE if not pass this have to go back
  // WEBres.send ( "Sender  Address invalid International Bank Account Nunmber (IBAN) checksum please check address again " ) ; 
  ADD_CHK_RES = "your  Sender Address invalid International Bank Account Nunmber (IBAN) checksum please check address again" ; 
  console.log ( "your  Sender Address invalid International Bank Account Nunmber (IBAN) checksum " ) ;
  // return false ; 
 }
 if ( !web3.utils.isAddress( rx_address  ) ) {   // GATE if not pass this have to go back
  // WEBres.send ( "your  Receiver Address invalid International Bank Account Nunmber (IBAN) checksum please check address again " ) ; 
  ADD_CHK_RES = ADD_CHK_RES +  "<br>your  Receiver  Address invalid International Bank Account Nunmber (IBAN) checksum please check address again" ; 
  console.log ( "your  RX Address invalid International Bank Account Nunmber (IBAN) checksum " ) ;
  // return false ; 
 }
 if ( ADD_CHK_RES != '' ) {
   WEBres.send ( ADD_CHK_RES  ) ;
   return false ; 
 }

 console.log('type of VALUE_ETH  ' + typeof VALUE_ETH  + " Address :" +  rx_address );
 console.log('Amount is : '+ tx_amonut + " Address :" +  rx_address );
// console.log('TX WEI    : ' +  web3.utils.toWei(TX_WEI, "wei")  + " Address :" +  rx_address );
// console.log('to WEI    : ' + web3.toWei( VALUE_ETH , "ether")  + " Address :" +  rx_address );
      
//        web3.personal.unlockAccount( TX_ac , TX_pass , 600)
web3.eth.personal.unlockAccount( TX_ac , TX_pass , 200 , function ( unLockerror , Unlocked_resp ) {  
	      if (unLockerror) {  
                  console.log(" Unlock has error is :  " + unLockerror ) ;
                  WEBres.send(" Unlocl Error is : " + unLockerror + " Please send again " ) ;
              } else {
                  // Handle after Unlock 
                  console.log("  " + Unlocked_resp ) 
                       //  Start send  // 
			     web3.eth.sendTransaction({
			     from: TX_ac,
			     to: rx_address ,
			     gas: 90000 ,
                             gasPrice: 18000000000 ,
			     value: web3.utils.toWei( VALUE_ETH , "ether") ,
			     }, function(err, transactionHash) {
				    if (err) {
					console.log(err);
                             WEBres.send( "Send ETH Error " + err     ) 
                             web3.eth.personal.lockAccount( TX_ac ) ;
				    } else {
                             web3.eth.personal.lockAccount( TX_ac ) ; 
                             WEBres.send( "Transaction " + " TxID : " + transactionHash ) 
          		     console.log("Transection ID:" + transactionHash);
          		     console.log("Locked A/C :" + TX_ac );
			    }
			   }   );

                      // END Send // 

//                  WEBres.send( "Status unlocked accoung is : " + Unlocked_resp ) 
	      }
  });  // web3 unlock


}) // END 

   webserver.get('/withdraw',(req, res) => {
      
     var TX_ac = '0xcCBf131eF66441be932943b920Ad6dB7Cbb0CC9A'
     var RX_ac = '0xebfc08b7bc351145010368bec2039e4564f45fa8'
     var VALUE_ETH = 100 
     var TX_WEI  = VALUE_ETH *  Math.pow(10, 18);
     web3.eth.personal.unlockAccount( TX_ac , 'jeffrey' , 100 )
     web3.eth.sendTransaction({
     from: TX_ac,
     to: RX_ac , 
     value: TX_WEI , 
     }, function(err, transactionHash) {
	    if (err) { 
		console.log(err); 
	    } else {
             console.log(transactionHash);
    }
   }   );
   });  // END


//function checkBalance() {
//   var address = document.getElementById("address").value;
//   web3.eth.getBalance(address, 'latest', function(err, result) {
//       if (err != null) {
//            console.error("Error while retrieving the balance for address["+address+"]: "+err);
//        }
//
//        var balance = Number(web3.fromWei(result, "ether"));
//        console.debug("Balance for address["+address+"]="+balance);
//
//        var balance_element = document.getElementById("balance");
//        balance_element.innerHTML = balance.valueOf();
//    }); 
//};


    webserver.listen(port) ;
