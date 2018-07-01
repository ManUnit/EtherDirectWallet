require('dotenv').config();
var fs = require('fs');
var path = require('path');
var Web3 = require('web3');
var web3 = new Web3();
var config = require('../etc/config');

web3.setProvider(new web3.providers.HttpProvider("http://202.151.178.21:58546"));

function createAccount(_password) {
    var nObj = web3.eth.accounts.create(_password);
    web3.eth.accounts.wallet.add(nObj.privateKey);
    //web3.eth.accounts.wallet.save(_password);
    return nObj;
}


var acc = createAccount("jeffrey888");
console.log("ACC " + JSON.stringify(acc.privateKey , null, '\t'));