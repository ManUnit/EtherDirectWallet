require('dotenv').config();
var fs = require('fs');
var path = require('path');
var CONWeb3 = require('web3');
var config = require('../etc/config.json');
var web3 =  new CONWeb3("http://" + config.RPCSVR + ":" + config.RPCPORT ) ;

var sendcfg = {
     "gas" : 21000 ,
     "gasprice" : 1800000000 ,   // 1.8GW
     "netfee" :  0.005    // 0.5 %
}
var  tokenD18atlease = web3.utils.toWei( "20" , "ether")    ;
exports.tokenD18atlease = tokenD18atlease
exports.sendcfg=sendcfg ;
