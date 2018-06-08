/*

 @@ This code Author by :  Anan Paenthongkham
 @@ License : Open source

*/
var express = require('express') ;
var config = require('./etc/config.json');
const util = require('util') ; // tool for view [object to JSON ]
var port = config.WEBPORT ;
var path = require('path');
var sessions = require('express-session') ; 
//var compression =  require('compression') ;
var Web3 = require('web3');  
var webserver = express() ;
//var webserver = express.createServer() ;
var bodyParser = require('body-parser') ;  // Get Post data
var web3 =  new Web3("http://" + config.RPCSVR + ":" + config.RPCPORT ) ;
var sleep = require('sleep');
function checkAuth (req, res, next) {
	        console.log('checkAuth ' + req.url);
	         if (req.url === '/' && (!req.session || !req.session.authenticated)) {
	           console.log('UN checkAuth ' + req.url);
	             res.sendFile(__dirname + '/pubhtml/Guest.html', { status: 403 });
	           // res.sendFile(__dirname + '/pubhtml/guest.html', { status: 403 });
	            return;
		 }
	        if (req.url === '/tokens' && (!req.session || !req.session.authenticated)) {
                     console.log ( "==== " + req.session + " : authen :  " + req.session.authenticated ) ;
	             res.sendFile(__dirname + '/pubhtml/unauthorised.html', { status: 403 });
	             return;
	         }
                         next();
	   } //  

webserver.use(express.static(path.join(__dirname, '/pubhtml')));
webserver.use( bodyParser.json()) ;
webserver.use( bodyParser.urlencoded({extended: true}) ) ;
webserver.use( sessions ({
             secret : "#$#$GF%^s%%^d45ed54%@@#&*" ,
	     resave : false, 
	     saveUninitialized : true 
           })) ;
webserver.use( checkAuth ) ;
//webserver.use(compression()); // Fixed some error 

// Database config 
var DBresp = require('./lib/mongoDb') ; // load function under mongDB.js
var options = { server: { socketOptions: { keepAlive: 1 } } };
console.log("Use RPC server]:" + config.RPCSVR + ":" + config.RPCPORT ) ;

 web3.eth.getAccounts(function(err, res){
     console.log(err, res)
  }
 )
   webserver.get('*'+'.html',(req, res ,next) => {
   //  console.log( " come to root ");
     res.sendFile(__dirname + '/pubhtml/404.html');
   })
   webserver.get('/',(req, res ,next) => {
     console.log( " come to root ");
     res.sendFile(__dirname + '/prihtml/welcome.html');
   })

   webserver.get('/logout', function (req, res, next) {
	                 delete req.session.authenticated;
	                 res.redirect('/');
	         });


   webserver.get('/account',(req, res,next) => {
     //res.sendFile(__dirname + '/pubhtml/account.html');
     res.sendFile(__dirname + '/prihtml/acd.html');
 
   })

   webserver.post('/account',(logreq, res , next) => {
          DBresp.data.chkpass(logreq.body.username, function(err, data){
                  if (
	                  logreq.body.username &&
	                  logreq.body.username === data.answer.userlogin &&
	                  logreq.body.password &&
	                  logreq.body.password === data.answer.password  &&
	                  data.answer.stat === "found" &&
	                  data.answer.error === null
	                 ){
                          logreq.session.authenticated = true;
                          res.redirect('/');
	                  } else {
                          logreq.session.authenticated = false  ;
                          //logreq.flash('error', 'Username and password are incorrect');
                          res.redirect('/');
                         } //
		 }) //
   }) ; //

   webserver.get('/tokens',(req, res) => {
     res.sendFile(__dirname + '/prihtml/smt.html');
     // console.log(__dirname);
   })

   webserver.get('/login',(req, WEBres) => {
    var user  = req.query.userlogin.trim() ; 
    var upass = req.query.therest  ;
    DBresp.data.chkpass(user, function(err, data)  {
       if( upass==data.answer.password && data.answer.stat == "found" && data.answer.error == null  ){
	  session =  req.session; 
	  session.authenticated = true;
  	  WEBres.redirect(  '/tokens'  ) ;
       }else {
          req.session.destroy();
          WEBres.redirect ('/account') ;
          //WEBres.send(  "Login Failed " ) ;
	} //
    });
  }) // END 

   webserver.get('/redirects',function (req,resp){
       if ( session.id ) {
               resp.redirect ('/admin') ;
	       console.log ( "Redirected with: " + session.id ) ;
       }else{
               resp.send(  "Who are  you  " ) ;
       } //
   }) ;
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

 //console.log ( "  CHECK Valid address : " + web3.utils.isAddress( rx_address  )  );

  if ( !web3.utils.isAddress( sender_address  ) ) {   // GATE if not pass this have to go back
      ADD_CHK_RES = "Sender Address invalid International Bank Account Nunmber (IBAN) checksum please check address again" ;
      console.log ( "Sender Address invalid International Bank Account Nunmber (IBAN) checksum " ) ;
   }
  if ( !web3.utils.isAddress( rx_address  ) ) {   // GATE if not pass this have to go back
   ADD_CHK_RES = ADD_CHK_RES +  "<br>Receiver Address invalid International Bank Account Nunmber (IBAN) checksum please check address again" ;
   console.log ( " RX Address invalid International Bank Account Nunmber (IBAN) checksum " ) ;
  }
 if ( ADD_CHK_RES != '' ) {
   WEBres.send ( ADD_CHK_RES  ) ;
   return false ; 
 }

 console.log('type of VALUE_ETH  ' + typeof VALUE_ETH  + " Address :" +  rx_address );
 console.log('Amount is : '+ tx_amonut + " Address :" +  rx_address );

web3.eth.personal.unlockAccount( TX_ac , TX_pass , 200 , function ( unLockerror , Unlocked_resp ) {  
	      if (unLockerror) {  
                  console.log(" Unlock has error is :  " + unLockerror ) ;
                  WEBres.send(" Unlock Error is : " + unLockerror + " Please send again " ) ;
                  web3.eth.personal.lockAccount( TX_ac ) ;
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
                             WEBres.send( "Transaction " + " TxID : <a href=http://"+ 
                                config.ExpolrerSvr.ip+":"+ config.ExpolrerSvr.port +"/tx/" + 
                                 transactionHash + ">" + transactionHash + "</a>"  )  ;
          		     console.log("Transection ID:" + transactionHash);
          		     console.log("Locked A/C :" + TX_ac );
			    }
			   }   );

                      // END Send // 
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
  
// webserver.get('*',(req, res) => {
//	   res.redirect('/') ;
//   }) ;
   webserver.get('*', function(req, res){
 	    res.send('what???', 404);
   });

var ser_var = webserver.listen(port) ;
console.log("open web  http://"+ ser_var.address().address + ":" + port) ;
console.log("CTRL+C to Exit") ;
