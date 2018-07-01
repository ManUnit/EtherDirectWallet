 // https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html 

'use strict';
const Web3 = require('web3');
const web3 = new Web3();
var fs = require('fs');
var path = require('path');

const wsAddress = 'http://202.151.178.21:58546';
const privateKey = '0x54d1783874adfdfd4458db370e98cc6736f6e5c15d6621d08c78b36652ab264d';
const contractAddress = '0xa70a8d416c22e5817323f2cebf233d929e5722a1';
const walletAddress = '0x6c4811FEB65FD028A3d5Bdd53Fe65681F620471D';
web3.setProvider(new web3.providers.HttpProvider("http://202.151.178.21:58546"));
var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './erc20_abi.json'), 'utf-8'));
const contract = new web3.eth.Contract(
    abiArray,
    contractAddress
);

const query = contract.methods.approve('0x7fFA8706B4BC45D25746456fe48E0376BBa66546', "123456700000000000000");
const encodedABI = query.encodeABI();

var gasPriceGwei = 2;
var gasLimit = 4712388 ;
var chainId = 9559;
const tx = {
    from: walletAddress,
    to: contractAddress,
    gas : 4712388 , 
    data: encodedABI,
    "chainId": chainId , 

};

const account = web3.eth.accounts.privateKeyToAccount(  privateKey); 
web3.eth.getBalance(walletAddress).then(console.log);

web3.eth.getTransactionCount(walletAddress, (err, count) => { 
  tx.nonce =   web3.utils.toHex(count + 1); // record update serial transaction count 
try {
web3.eth.accounts.signTransaction(tx,  privateKey ).then(signed => {
    const tran = web3.eth
        .sendSignedTransaction(signed.rawTransaction)
        .on('confirmation', (confirmationNumber, receipt) => {
            console.log('=> confirmation: ' + confirmationNumber);
        })
        .on('transactionHash', hash => {
            console.log('=> hash');
            console.log(hash);
        })
        .on('receipt', receipt => {
            console.log('=> reciept');
            console.log(receipt);
        })
        .on('error', console.error);
});
} catch (e){
  console.log ( "error" + e)
}

}) ;