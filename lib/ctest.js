///const getCoinBalance = async (req, callback) => {
// Head 
require('dotenv').config();
var fs = require('fs');
var path = require('path');
var CONWeb3 = require('web3');
var config = require('../etc/config.json');
var web3 = new CONWeb3("http://" + config.TKRPCSVR + ":" + config.RPCPORT);
var coinbase = {};

//var sendconfig = require ("./private") ;
var Tx = require('ethereumjs-tx');
var mathFunc = require('./mathFunc');


coinbase.App = async function (reqSendAdress,reqDestAdress , reqTokenContract ,sendCrypt, sendAmount  , callback) {
    console.log(`web3 version: ${web3.version}`)
    var myAddress =  reqSendAdress ;
    var destAddress = reqDestAdress  ;
    var transferAmount = sendAmount  ;
    var count = await web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
    var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './erc20_abi.json'), 'utf-8'));
//    var contractAddress = "0xf1d28bac210b14b75e6ce1d529a1221c17579bfe";
    var contractAddress = reqTokenContract ;
    var contract = new web3.eth.Contract(abiArray, contractAddress, {
        from: myAddress
    });
    var balance_bf = await  contract.methods.balanceOf(myAddress).call();
    // console.log(`Balance before send: ${financialMfil(balance)} 2FL Token \n------------------------`);
        //  web3.utils.fromWei(customerBalance.add(customerRefundableEther)
        //    .sub(transactionFee).toString(), 'ether')
 //    console.log(`Balance before send: ` + mathFunc.numberWithCommas (web3.utils.fromWei( balance_bf.toString(),'ether')) +  ` 2FL Token \n------------------------`);

    balance = await contract.methods.balanceOf(myAddress).call();
    //console.log(`Balance after send: ${financialMfil(balance)} 2FL Token `);
        //
    // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
    var gasPriceGwei = 30;
    var gasLimit = 999000;
    var chainId = 9559;
    var rawTransaction = {
        "from": myAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
        "gasLimit": web3.utils.toHex(gasLimit),
        "to": contractAddress,
        "value": "0x0",
        "data": contract.methods.transfer(destAddress, transferAmount).encodeABI(),
        "chainId": chainId
    };
    console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction, null, '\t')}\n------------------------`);
    var privKey = new Buffer( sendCrypt  , 'hex');
    var tx = new Tx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`);
    try {
       var receipt = await  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    }
    catch (err) {
        console.log ( " ++++++++++++ Send Error  +++++++++++++++\n" ) ;
   //     console.log ( err ) ;
         callback( "send error" + err ,   null  ); 
         return false ;
    }
    console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`);
        callback ( null , receipt ) ;
    balance = await contract.methods.balanceOf(myAddress).call();
  //  console.log(`Balance before send: ` + mathFunc.numberWithCommas (web3.utils.fromWei( balance_bf.toString(),'ether')) +  ` 2FL Token `);
   // console.log(`Balance  after send: ` + mathFunc.numberWithCommas (web3.utils.fromWei( balance.toString(),'ether')) +  `  2FL Token `);
}


exports.coinbase = coinbase // Method