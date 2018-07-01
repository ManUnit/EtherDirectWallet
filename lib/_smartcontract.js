require('dotenv').config();
var fs = require('fs');
var path = require('path');
var Web3 = require('web3');
var web3 = new Web3();
var config = require('../etc/config');
var Tx = require('ethereumjs-tx');

web3.setProvider(new web3.providers.HttpProvider("http://202.151.178.21:58546"));
var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './erc20_abi.json'), 'utf-8'));
// ontractInterface.options

var contractInterface = new web3.eth.Contract(abiArray, '0xa70a8d416c22e5817323f2cebf233d929e5722a1');
// var contractInterface = new web3.eth.Contract(abiArray , '0xa70a8d416c22e5817323f2cebf233d929e5722a1',{
// 	from : '0x6c4811FEB65FD028A3d5Bdd53Fe65681F620471D' ,
// 	gasPrice : '20000000000000' ,
// 	gas : 5000000 , 
// });

contractInterface.options.from = '0x6c4811FEB65FD028A3d5Bdd53Fe65681F620471D'
contractInterface.options.gasPrice = '20000000000000'; // default gas price in wei
contractInterface.options.gas = 5000000; // provide as fallback always 5M gas
//var ContractInstance = contractInterface.at('0xa70a8d416c22e5817323f2cebf233d929e5722a1');

//console.log("Address : " + contractInterface.options.address ) ;
// console.log('config :  ' + JSON.stringify(config,null,'\t')   )
// console.log('ABI  : ' + JSON.stringify(abiArray,null,'\t')   )
//console.log("ABI : " + JSON.stringify(contractInterface.options.jsonInterface,null,'\t' ) );
var getCoinBalance = async function(callback) {
    var balance = await contractInterface.methods.balanceOf('0x6c4811FEB65FD028A3d5Bdd53Fe65681F620471D').call()
    callback(null, balance);
}
//
contractInterface.methods.totalSupply().call()
    .then(console.log);


getCoinBalance(function(err, res) {
    console.log("Balance " + res);
});

var sendCrypt = '54d1783874adfdfd4458db370e98cc6736f6e5c15d6621d08c78b36652ab264d' //  "0x6c4811FEB65FD028A3d5Bdd53Fe65681F620471D"



//signTransaction
var privKey = new Buffer(sendCrypt, 'hex');
var gasPriceGwei = 30;
var gasLimit = 999000;
var chainId = 9559;
var rawTransaction = {
    "from": "0x6c4811FEB65FD028A3d5Bdd53Fe65681F620471D",
    "nonce": "0x68",
    "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
    "gasLimit": web3.utils.toHex(gasLimit),
    "to": '0xa70a8d416c22e5817323f2cebf233d929e5722a1',
    "value": "0x0",
    "data": contractInterface.methods.approve('0x7fFA8706B4BC45D25746456fe48E0376BBa66546', "1000000000000000000").encodeABI(),
    "chainId": 9559
};

var tx = new Tx(rawTransaction);
tx.sign(privKey);
var serializedTx = tx.serialize();


var txData = contractInterface.methods.approve('0x7fFA8706B4BC45D25746456fe48E0376BBa66546', "1000000000000000000").encodeABI()
const bx = {
    from: '0x6c4811FEB65FD028A3d5Bdd53Fe65681F620471D',
    to: '0xa70a8d416c22e5817323f2cebf233d929e5722a1',
    data: txData, 
    nonce : "0x66" , 
    "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
    "gasLimit": web3.utils.toHex(gasLimit),
    value: web3.utils.toWei('0.002', 'ether')
};

var sendApprove = async function(callback) {
    try {
        var receipt = await web3.eth.signTransaction(bx, privKey);
        callback(null, receipt); 
    } catch (e) {
        console.log(e);
        callback(e, receipt);
    }
    console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`);
    callback(null, receipt);
    return;
}

sendApprove(function(err, res) {
    console.log("IF Error " + err + ' Response ' + res);
});

