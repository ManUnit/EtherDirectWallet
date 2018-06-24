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
var  tokenD18atlease = web3.utils.toWei( "1" , "ether")    ;
exports.tokenD18atlease = tokenD18atlease
exports.sendcfg=sendcfg ;
