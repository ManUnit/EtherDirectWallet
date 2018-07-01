/*
 * 2Coin private block ciahn
 *
 *
*/
const util = require('util') ; // tool for view [object to JSON ]
var path = require('path');
var CONWeb3 = require('web3');
var config = require('../etc/config.json') ;
var web3 =  new CONWeb3("http://" + config.RPCSVR + ":" + config.RPCPORT ) ;
console.log (web3.utils.fromWei( "3423837732949323425392388453453222",'ether') ) ;
exports.web3=web3  ; // Var
//
