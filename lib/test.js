// coinbase.getCoinBalance 
// 0x2c29f4c04D9Acf4878A52C786B44069874878358
// contract 0x6c5f17249d937bd7bca310a87a306538b9e482e5
var  coinFunc  = require('./coinfunction')
var  mathFunc  = require('./mathFunc')
var coin = "" ;
var token = "" ;
var coin = coinFunc.coinbase.getCoinBalance ( "0x2c29f4c04D9Acf4878A52C786B44069874878358"  , function ( err , res  ) {
	if ( res ) console.log( " Coin OUTPUT : " + mathFunc.numberWithCommas(res / 1e18 ) ) ;
});

var token = coinFunc.coinbase.getTokenBalance  ( "0x2c29f4c04D9Acf4878A52C786B44069874878358" , "0x6c5f17249d937bd7bca310a87a306538b9e482e5"  , function ( err , res  ) {
	if ( res ) console.log( " Token OUTPUT : " +  mathFunc.numberWithCommas(res / 1e18 )  ) ;
});


console.log ( "Coin : " + coin + " token : " + token ) ;
