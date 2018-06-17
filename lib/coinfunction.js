///const getCoinBalance = async (req, callback) => {
// Head 
var fs = require('fs');
var path = require('path');
var CONWeb3 = require('web3');
var config = require('../etc/config.json');
var web3 =  new CONWeb3("http://" + config.RPCSVR + ":" + config.RPCPORT ) ;
var coinbase = {} ;

coinbase.getCoinBalance = async function (req, callback) {
// 	console.log( " ADR " + req ) ;
        try {
             var balance = await  web3.eth.getBalance( req  ) ;
        }catch(e){
             callback ( "has error => " + e , null  ) ;
        }
             callback (null , balance)  ;
             return balance  ;
}  // END getCoinBalance


coinbase.getMultiCoinBalance = async function (req, res_name , res_adr,  cout , callback) {
	// console.log( " ADR " + req ) ;
	var counter = cout  ;
	var rname = res_name ;
	var radr = res_adr ;
        try {
             var balance = await  web3.eth.getBalance( req  ) ;
        }catch(e){
             callback ( "has error =====> " + e ,null,null, null , null  ) ;
        }
             callback (null ,rname,radr ,counter , balance)  ;
             return true ;
}  // END getCoinBalance

coinbase.getTokenBalance = async function (reqAdress,reqToken, callback) {
          // console.log(`web3 version: ${web3.version}`)
            var myAddress = reqAdress ;
            var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './erc20_abi.json'), 'utf-8'));
            var contractAddress = reqToken ;
            var contract = new web3.eth.Contract(abiArray, contractAddress, {
                        from: myAddress
             });
        try {
            var balance_of = await  contract.methods.balanceOf(myAddress).call()
        }catch(e){
             callback ( "has error =====> " + e , null  ) ;
        }
             callback (null , balance_of)  ;
             return balance_of ;
}  // END getTokenBalance



exports.coinbase=coinbase // Method

