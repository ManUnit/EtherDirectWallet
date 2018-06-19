/*

 @@ This code Author by :  Anan Paenthongkham
 @@ License : Open source

*/
var express = require('express') ;
var config = require('./etc/config.json');
var DBresp = require('./lib/mongoDb') ; // load function under mongDB.js
var coinFunc = require('./lib/coinfunction') ; // 
var TXTdata = require('./lib/txtdata') ; // 
var TokenCfg  = require('./lib/tokenconfig') ; // 
var mathFunc = require('./lib/mathFunc') ; // 
const util = require('util') ; // tool for view [object to JSON ]
var port = config.WEBPORT ;
var path = require('path');
var CookieParser = require ('cookie-parser') ;
var sessions = require('express-session') ; 
//var compression =  require('compression') ;
var Web3 = require('web3');  
var webserver = express() ;
//var webserver = express.createServer() ;
var bodyParser = require('body-parser') ;  // Get Post data
var web3 =  new Web3("http://" + config.RPCSVR + ":" + config.RPCPORT ) ;
var sleep = require('sleep');
var mathFunc = require('./lib/mathFunc') ; // load function under mongDB.js
//
//
//
// === Pages Checking 
//
//
//
function checkAuth (req, res, next) {
	        console.log('checkAuth ' + req.url);
	         if (req.url === '/' && (!req.session || !req.session.authenticated)) {
	           console.log('UN checkAuth ===>' + req.url);
	             res.sendFile(__dirname + '/pubhtml/Guest.html', { status: 403 });
	           // res.sendFile(__dirname + '/pubhtml/guest.html', { status: 403 });
	            return;
		 } //
	        if (req.url === '/tokens' && (!req.session || !req.session.authenticated)) {
                     console.log ( "==== " + req.session + " : authen :  " + req.session.authenticated ) ;
	             res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
	             return;
	         } //
	        if (req.url === '/withdraw' && (!req.session || !req.session.authenticated)) {
                     console.log ( "come with draw without authen " + req.session + " : authen :  " + req.session.authenticated ) ;
	             res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
	             return;
	         } //
	        if (req.url === '/assetview' && (!req.session || !req.session.authenticated)) {
                     console.log ( "come to asset  authen check :  " + req.session + " : authen :  " + req.session.authenticated ) ;
	             res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
	             return;
	         } // 
	        if (req.url === '/sendasset' && (!req.session || !req.session.authenticated)) {
                     console.log ( "come to asset  authen check :  " + req.session + " : authen :  " + req.session.authenticated ) ;
	             res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
	             return;
	         } // 
	        if (req.url === '/dextransfer'  && (!req.session || !req.session.authenticated)) {
                     console.log ( "come to asset  authen check :  " + req.session + " : authen :  " + req.session.authenticated ) ;
	             res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
	             return;
	         } // 
	        if (req.url === '/coinsview' && (!req.session || !req.session.authenticated)) {
                     console.log ( "come to coinsview  authen check :  " + req.session + " : authen :  " + req.session.authenticated ) ;
	             res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
	             return;
	         } // 
	        if (req.url === '/depview' && (!req.session || !req.session.authenticated)) {
                    // console.log ( "come to coinsview  authen check :  " + req.session + " : authen :  " + req.session.authenticated ) ;
	             res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
	             return false;
	         } // 
	        if (req.url === '/txmode' && (!req.session || !req.session.authenticated)) {
                     console.log ( "come to coinsview  authen check :  " + req.session + " : authen :  " + req.session.authenticated ) ;
	             res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
	             return;
	         } // 
                 next();
	   } //  

webserver.use(express.static(path.join(__dirname, '/pubhtml')));
webserver.use( bodyParser.json()) ;
webserver.use( CookieParser()) ;
webserver.use( bodyParser.urlencoded({extended: true}) ) ;
webserver.use( sessions ({
             secret : "#$#$GF%^s%%^d45ed54%@@#&*" ,
	     resave : false, 
	     saveUninitialized : true 
           })) ;
webserver.use( checkAuth ) ;
//webserver.use(compression()); // Fixed some error 

// Database config 
var options = { server: { socketOptions: { keepAlive: 1 } } };
console.log("Use RPC server]:" + config.RPCSVR + ":" + config.RPCPORT ) ;

 web3.eth.getAccounts(function(err, res){
     console.log(err, res)
  }
 )
   webserver.get('*'+'.html',(req, res ,next) => {
   //  console.log( " come to   ");
     res.sendFile(__dirname + '/pubhtml/404.html');
   })
   webserver.get('/',(req, res ,next) => {
     console.log( " come to Atherized  : " + req.session.id +  "   " + req.session.authenticated  );
     res.sendFile(__dirname + '/prihtml/welcome.html');
   })

   webserver.get('/logout', function (req, res, next) {
	                 req.session.destroy();
	                 res.sendFile(__dirname + '/errhtml/logedout.html');
	         });


   webserver.get('/account',(req, res,next) => {
     //res.sendFile(__dirname + '/pubhtml/account.html');
     res.sendFile(__dirname + '/prihtml/login.html');
 
   })

   webserver.post('/account',(logreq, res , next) => {

	  var inUsername = "" ;
	   if ( logreq.body.username ) inUsername = logreq.body.username.toLowerCase() ;

          DBresp.data.Regchkpass(inUsername , function(err, data){
                  if (
	                  inUsername &&
	                  inUsername  === data.answer.userlogin &&
	                  logreq.body.password &&
	                  logreq.body.password === data.answer.password  &&
	                  data.answer.stat === "found" &&
	                  data.answer.error === null
	                 ){
                          logreq.session.authenticated = true;
                          logreq.session.objid = data.answer.objid ;
                          logreq.session.userid = data.answer.userid ;
                          logreq.session.username = data.answer.userlogin ;
			  // Checking another session 
			  // findSesion 
			  var x = "" ;
			  var unixtime =  Math.round((new Date()).getTime() / 1); ; 
			  // console.log ( " Unix time : " + unixtime ) ;
			  //DBinfo  insertSession =  function ( userId , sess ,unixtime , ipaddress , SSdata )
			  DBresp.data.insertSession( 
				  data.answer.userid ,
				  logreq.session.id , 
				  unixtime  ,
				  logreq.connection.remoteAddress ,
				  function(err, ssData){

			  })  //
                          res.redirect('/');
			  return true ;
	                  } else {
                          logreq.session.authenticated = false  ;
                          //logreq.flash('error', 'Username and password are incorrect');
                          res.sendFile( __dirname + '/errhtml/loginfail.html');
			  return false  ;
                         } //
		 }) //
   }) ; //


   webserver.get('/registor',(req, res,next) => {
     //res.sendFile(__dirname + '/pubhtml/account.html');
     res.sendFile(__dirname + '/prihtml/registor.html');
   })

   webserver.post('/registor',(Rereq, Reres , next) => {
	   // chkUser,chkEmail,callback 
	  var ReqName,ReqEmail = "" ;
	  if ( Rereq.body.username ) ReqName = Rereq.body.username.toLowerCase() ;
	  if ( Rereq.body.useremail ) ReqEmail = Rereq.body.useremail.toLowerCase();
	   console.log( " User Name " + ReqName + "  Email : " + ReqEmail ) ;
	  if ( Rereq.body.useremail === ''  || Rereq.body.username === '' || 
	       Rereq.body.ftpassword === '' || Rereq.body.ndpassword === '' || 
	       Rereq.body.firstname === '' || Rereq.body.lastname === ''  
	  ) {
                 console.log("No enough registor info " ) ;
                 Reres.send( "no input enough request all fill " + "<a href='/registor'> Registor </a> "  );
		  return false ;
	  } 
	  if (  Rereq.body.ftPassword != Rereq.body.ndPassword   ){
	                  console.log("Password not match" ) ;
                          //res.send( "Password mismatch" );
                          Reres.send( "Password mismatch" + "<a href='/registor'> Registor again </a> "  );
		  return false ; 
	  }//
          DBresp.data.regExisting( Rereq.body.username,Rereq.body.useremail , function(err, data){
		  console.log ( " CHK ANSWER DATA   " + data.answer.userlogin + "   " +  data.answer.email +  "  "  + data.answer.stat + "  " + data.answer.error ) ;
                  if (
	                  ReqName  == data.answer.userlogin || 
	                  ReqEmail  == data.answer.email  || 
	                  data.answer.stat == "existing" ||
	                  data.answer.error != null 
	                 ){
                          Reres.send( "Existing user or email were regristoered " + " user :" + data.answer.userlogin + " email  :" + data.answer.email + "  stat : " + data.answer.stat + " ==> " + "<a href='/registor'> Registor again </a> "  );
			  return false  ; 
	                  } else {
                        // Reres.send( "All OK " + Rereq.body.useremail +  "<a href='/registor'> Registor again </a> "  );
			//  uname,fname,lname,email,birth,pass 
		          var uname = ReqName ; 
			  var fname = Rereq.body.firstname ; 
			  var lname = Rereq.body.lastname ; 
		          var email = ReqEmail ; 
		          var birth = Rereq.body.birthdate ;
			  var pass =  Rereq.body.ftPassword ;  

	                  DBresp.data.insertReg( uname,fname,lname,email,birth,pass,function(err, dat){
	                  //DBresp.data.insertLoginUser( uname,fname,lname,email,birth,pass,function(err, dat){
			   if (err) return false ;
                             console.log ( " RETURN INSERT " + dat ) ;
                             Reres.send( "Registoring  done !! " + dat +  " Go login just click <a href='/account'> Go Login </a> "  );
			   return true ;
			  }) // End insert 
                         } //
		 }) //
   }) ; //

   webserver.get('/tokens',(req, res) => {
     res.sendFile(__dirname + '/prihtml/smt.html');
     // console.log(__dirname);
   })

  webserver.get('/loginuser',(req, WEBres) => {
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

   webserver.get('/depview',(req, res) => {
	   // console.log (web3.utils.fromWei( "3423837732949323425392388453453222",'ether') ) ;
	   if ( !req.session.authenticated || !req.session ){ res.send ( "Re Login again <a href='/account'   > Login </a> " ); return } ;
	   var userid = req.session.userid ;
	    // console.log("Session uid : " + req.session.userid ) ;
	   //var userid = req.query.amount ;
	   var x,txt = "" ;
	   DBresp.data.findDepAddr ( userid , function (err,data){
	   if (err) throw err ;  
	   if (data) for ( x in data ) {   
		  var bgSwitch = "" ;
		  if(x%2==0){ bgSwitch = 'style="background-color: #dddddd; color: #000000"' }else{
			      bgSwitch = 'style="background-color: #ffffff; color: #000000"' 
		  } ;
   	   //console.log ( "TOKEN Name  "+  data[x].tokenName + " Addr   " + data[x].tokenAddr + " CONTRACT : " + data[x].contractAddr  ) ;
	   txt += ('<div class="row"><div class="col" ' + bgSwitch +'  >' + data[x].depName +
		   ' Address : ' +
		     data[x].depAddr +
		   '</div></div>' ) ;
		} // 
              res.send( txt  );
           //   console.log( "data sent: "  +  txt  );
//            res.send( "Hello World : " + req.session.userid + "  OBJ id" + req.session.objid + " UID " + req.session.uid  );
           }) // End chk 
	   return ; 
   }) // End Get 

   webserver.get('/coinsview',(req, res) => {
	   // console.log (web3.utils.fromWei( "3423837732949323425392388453453222",'ether') ) ;
	   if ( !req.session.authenticated ){ res.send( TXTdata.cnlogin  ); return } ;
	   var userid = req.session.userid ;
	    // console.log("Session uid : " + req.session.userid ) ;
	   //var userid = req.query.amount ;
	   var x,txt = "" ;
	   DBresp.data.coinsBalance ( userid , function (err,data){
	   if (err) { res.send (" Nothing ")     ;  return  err  } ;  
           if (data.length == 0 ) { console.log(" Nothing "+ data.length ) ;  res.send ( "Nothing " )  } ;
           var jdata = [] ;
	   if (data.length > 0 ) for ( x in data ) {   
   	   //console.log ( "TOKEN Name  "+  data[x].tokenName + " Addr   " + data[x].tokenAddr + " CONTRACT : " + data[x].contractAddr  ) ;
	   txt += ('<div class="row"><div class="col" style="background-color: #dddddd; color: #333333"  >'+ data[x].coinName +
		   ' Balance : '  +
		   mathFunc.numberWithCommas (web3.utils.fromWei( data[x].coinBalance.toString(),'ether'))  +
		   '</div></div>' ) ;
		} // 
	      jdata = {
                        "ERROR" : "" ,
                        "position" : "coinview" ,
		        "item" : x ,
		        "res_div" : txt ,
		        "coin_address" : data[x].coinAddr
	      }; 
	      console.log ( " Data  " + JSON.stringify(jdata) ) ;
              res.send( jdata  );
           //   console.log( "data sent: "  +  txt  );
//            res.send( "Hello World : " + req.session.userid + "  OBJ id" + req.session.objid + " UID " + req.session.uid  );
           }) // End chk 
	   return ; 
   }) // End Get 

   webserver.get('/assetview',(req, res) => {
	   if ( !req.session.authenticated ){ res.send ( TXTdata.aslogin ); return } ;
	   var userid = req.session.userid ;
	   console.log("Session uid : " + req.session.userid ) ;
	   //var userid = req.query.amount ;
	   var x,txt = "" ;
	   var jdata = [] ;
	   DBresp.data.tokensBalance ( userid , function (err,data){
	   if (err) return  err ;  
	   if (data) for ( x in data ) {   
   	   //console.log ( "TOKEN Name  "+  data[x].tokenName + " Addr   " + data[x].tokenAddr + " CONTRACT : " + data[x].contractAddr  ) ;
	   txt += ('<div class="row"><div class="col" style="background-color: #ddddff; color: #333333" >'+ data[x].tokenName + 
		   ' Balance :  ' + 
		   mathFunc.numberWithCommas (web3.utils.fromWei( data[x].tokenBalance.toString(),'ether'))  +
		   '</div></div>' ) ;
		   jdata = {
			   "item" : x ,
			   "res_div" : txt ,
			   "ERROR" : "" ,
			   "asset_Address" : data[x].tokenAddr,
			   "asset_contract" : data[x].contractAddr
		  // "asset_cryptkey" : data[x].cryptkey
		   } // 
		} // 
              console.log ( JSON.stringify( jdata ) ) ;
              res.send( jdata  );
           //   console.log( "data sent: "  +  txt  );
//            res.send( "Hello World : " + req.session.userid + "  OBJ id" + req.session.objid + " UID " + req.session.uid  );
           }) // End chk 
	   return ; 
   }) // End Get 

   webserver.get('/sendasset', function (req, web_res, next) {
	   console.log (  "ASS DATA " + JSON.stringify(req.query,null,'\t') ) ;
	   console.log (  "SESSION DATA " + JSON.stringify(req.session,null,'\t') ) ;
	   if ( !req.session.authenticated ){
                   console.log ( " no authen at /sendasset  " + JSON.stringify(TXTdata.aslogin,null,'\t')  ) ;
		   web_res.send ( TXTdata.aslogin ); return  ; } ;
	   var userid = req.session.userid ;
	   var pointer = req.query.pointer ;
	   var asset_contract = req.query.asset_contract ;
	   var SenderAddress = req.query.SenderAddress ;
	   var receiverAddress = req.query.receiverAddress ;
	   var assetAmount = req.query.assetAmount ;
	   var sparse = req.query.sparse ;
	   var x,txt = "" ;
	   var jdata = [] ;
	   DBresp.data.idChkPass( userid  , function(psserr, pssdata){ 
                   console.log ( " #################" , JSON.stringify(pssdata,null,'\t') ) ; 
		   if ( pssdata.answer.password === sparse ) {    
		//	   web_res.send(TXTdata.assendvalerr) ; 
			   DBresp.data.PairChkTokens ( userid , SenderAddress , receiverAddress ,
				   asset_contract , assetAmount , sparse  ,  function (err,tokenDatas){
			   if (err) return  err ;  
			   console.log ( " ======> " + JSON.stringify(tokenDatas,null,'\t') ) ;
		           var ETvalue = tokenDatas[0].tokenBalance   ; 			   
		           var txAssetValue = web3.utils.toWei( assetAmount  , "ether")  ; 			   
		           var resContract = tokenDatas[0].contractAddr  ;
		           var resCryptKey = tokenDatas[0].cryptkey  ;
		           var BeETtxAssetValue    =   web3.utils.fromWei(txAssetValue, "ether") ;
		           var BeETtokenD18atlease =   web3.utils.fromWei(TokenCfg.tokenD18atlease, "ether") ;
	                   console.log ( " CHK CONVERTED VAL " + BeETtxAssetValue +  " :  " + BeETtokenD18atlease  ) ; 
			   if ( (BeETtxAssetValue/1)  < (BeETtokenD18atlease/1)  ){ 
				  console.log ( " ERR low value \n" +  JSON.stringify(TXTdata.assendvalerr,null,'\t')  ) 
				  web_res.send(TXTdata.assendvalerr) ;  return }  ;

                             coinFunc.coinbase.sendAsset (   // do hard function 
		                     SenderAddress ,
                                     receiverAddress ,
                                     resContract  ,
                                     resCryptKey ,
                                     txAssetValue ,
                                     function ( err , res  ) {
                          if ( res ) console.log( " Coin OUTPUT : \n\n\n\n\n" +
				  "DONE ! TXiD  " + JSON.stringify(res.transactionHash ,null,'\t' ) )    ;
                           });

			   }) // END if  in PairsendTokens  
			  }   // END Check balance 
		     // web_res.send( jdata  );
	   })  ;  /// End chk password  
	   return ; 
});

  webserver.get('/assets',(req, WEBres) => {
   //var user  = req.query.userlogin.trim() ; 
   var crypt = req.query.cryptid  ;
   if ( crypt == null ) {
       WEBres.sendFile(__dirname + '/prihtml/asset.html');
    //    WEBres.send("Hello world : " + JSON.stringify(req.session) );
    }else {
        WEBres.send(  "Just nothing " ) ;
    }

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
if ( !req.session.authenticated ){ WEBres.send ( {
		"ERROR" : "Re Login again <a href='/account'   > Login </a> " ,
		"coin_address" : "0x0" ,
		"item" : -1 ,
		"res_div" : '<div class="col" > </div>'
        }); return } ;	
 console.log( " RES DATA " + JSON.stringify(req.query) ) ;
var pointer  = req.query.pointer ; 
var tx_amonut  = req.query.amount ; 
var rx_address = req.query.receiverAddress.trim()  ;
var sender_address = req.query.senderAddress.trim()  ;
var sender_pass = req.query.sendparse  ;
var TX_ac = sender_address ;
var VALUE_ETH = tx_amonut;  
var TX_WEI  = VALUE_ETH *  Math.pow(10, 18)  ;
var TX_pass = sender_pass; 
var ADD_CHK_RES = '' ;
console.log("Pointer = " + pointer ) ;
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
   WEBres.send ( { "co_addr_res" : ADD_CHK_RES } ) ;
   return false ; 
 }

 console.log('type of VALUE_ETH  ' + typeof VALUE_ETH  + " Address :" +  rx_address );
 console.log('Amount is : '+ tx_amonut + " Address :" +  rx_address );

 web3.eth.personal.unlockAccount( TX_ac , TX_pass , 200 , function ( unLockerror , Unlocked_resp ) {  
	      if (unLockerror) {  
                  console.log(" Unlock has error is :  " + unLockerror ) ;
                  WEBres.send( { "co_addr_res"  : " Unlock Error is : " + unLockerror + " Please send again " }) ;
                  web3.eth.personal.lockAccount( TX_ac ) ;
              } else {
                  // Handle after Unlock 
                  console.log("  " + Unlocked_resp ) 
                       //  Start send  // 
			     web3.eth.sendTransaction({
			     from: TX_ac,
			     to: rx_address ,
			     gas: TokenCfg.sendcfg.gas ,   // 21000 wei
                             gasPrice: TokenCfg.sendcfg.gasprice ,   // 1.8Gwei
			     value: web3.utils.toWei( VALUE_ETH , "ether") ,
			     }, function(err, transactionHash) {
				    if (err) {
					console.log(err);
                             WEBres.send( { "co_addr_res" :  "Send ETH Error " + err  }    ) 
                             web3.eth.personal.lockAccount( TX_ac ) ;
				    } else {
                             web3.eth.personal.lockAccount( TX_ac ) ; 
                             WEBres.send( { "co_addr_res"  :  "Transaction " + " TxID : <a href=http://"+ 
                                config.ExpolrerSvr.ip+":"+ config.ExpolrerSvr.port +"/tx/" + 
                                transactionHash + ">" + transactionHash + "</a>" } )  ;

          		     console.log("Transection ID:" + transactionHash);
          		     console.log("Locked A/C :" + TX_ac );
			    }
			   }   );

                      // END Send // 
	      }
  });  // web3 unlock


}) // END 
/*
 */ 
   webserver.get('*', function(req, res){
	   res.setHeader('content-type', 'application/txt');
 	    res.send('what???', 404);
   });

var ser_var = webserver.listen(port) ;
console.log("open web  http://"+ ser_var.address().address + ":" + port) ;
console.log("CTRL+C to Exit") ;
