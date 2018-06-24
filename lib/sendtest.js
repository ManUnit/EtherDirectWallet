// coinbase.getCoinBalance 
// 0x2c29f4c04D9Acf4878A52C786B44069874878358
// contract 0x6c5f17249d937bd7bca310a87a306538b9e482e5
var  coinFunc  = require('./coinfunction')
var  DBsend  = require('./mongoDb')
var  mathFunc  = require('./mathFunc')
var coin = "" ;
var token = "" ;
var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

/*
var coin = coinFunc.coinbase.getCoinBalance ( "0x2c29f4c04D9Acf4878A52C786B44069874878358"  , function ( err , res  ) {
	if ( res ) console.log( " Coin OUTPUT : " + mathFunc.numberWithCommas(res / 1e18 ) ) ;
});

var token = coinFunc.coinbase.getTokenBalance  ( "0x2c29f4c04D9Acf4878A52C786B44069874878358" , "0x6c5f17249d937bd7bca310a87a306538b9e482e5"  , function ( err , res  ) {
	if ( res ) console.log( " Token OUTPUT : " +  mathFunc.numberWithCommas(res / 1e18 )  ) ;
});
*/
// (reqSendAdress,reqDestAdress , reqTokenContract ,sendCrypt, sendAmount  , callback)
var coin = coinFunc.coinbase.sendAsset ( "0x82378cf137F5dF4FA730529eB79a4583EA605FA9" ,
                                         "0xd1dc78f2865a7288a4a4b84272aaa5316cf37bab",
                                         "0xa70a8d416c22e5817323f2cebf233d929e5722a1" ,
                                         "b859aaa53eac3228fe89e2565b4e74dff83e44312e878c5859f0ef18a73d5328" ,
                                         "10001234500000000054321" ,
	                                  function ( err , res  ) {
	if ( res ) console.log( " Coin OUTPUT : " + mathFunc.numberWithCommas(res / 1e18 ) ) ;
});
/*
 new Date(Date.now()).toLocaleString();
	var datetime =  new Date(Date.now()).toLocaleString(); 
	var ownerid = 1  ; 
	var cryptoname = "2COIN" ;
	var txaddress  = "0x82378cf137F5dF4FA730529eB79a4583EA605FA9" ;
	var rxaddress  = "0x6c4811feb65fd028a3d5bdd53fe65681f620471d" ;
	var value  = "20" ;
	var netfee  =  0 ;
	var contract  = "0xa70a8d416c22e5817323f2cebf233d929e5722a1"  ;
	var txhash  = "0xcb9edce7e78f973f6b8e903d06d5d259a52f4429cd6eaae8e7538eea4dd082b7" ;
	var transacdata = { "test"  : "RAW DATA" }   ;
	var massage  = "" ;

DBsend.data.insertTransac( datetime , ownerid , cryptoname , txaddress  , rxaddress ,
                     value, netfee,contract,txhash,transacdata,massage,function ( err , res ){ 
   if (err) { console.log ( err ); return false }; 
   console.log ( res ) ;			    
 }) ;

*/

console.log ( "Coin : " + coin + " token : " + token ) ;
