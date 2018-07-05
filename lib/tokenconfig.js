require('dotenv').config();
var fs = require('fs');
var path = require('path');
var CONWeb3 = require('web3');
var config = require('../etc/config.json');
var web3 =  new CONWeb3("http://" + config.RPCSVR + ":" + config.RPCPORT ) ;

var sendcfg = {
     "gas" : 90000 ,
     "gasprice" : 20 * 1e9 ,   // 1.8GW
     "netfee" :  0.005    // 0.5 %
}
var  tokenD18atlease = web3.utils.toWei( "0.000000001" , "ether")    ;
var  ContractSenderBalance =  "0.000000001"   ;
var  ServeApproveGas = "0.002" ;

exports.tokenD18atlease = tokenD18atlease ; 
exports.ServeApproveGas = ServeApproveGas ;
exports.ContractSenderBalance = ContractSenderBalance ; 
exports.sendcfg=sendcfg ;
