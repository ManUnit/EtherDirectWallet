///const getCoinBalance = async (req, callback) => {
// Head 
const util = require('util')
require('dotenv').config();
var fs = require('fs');
var path = require('path');
//var CONWeb3 = require('./web3.js-0.20.6/lib/web3') ; 
var CONWeb3 = require('web3');
//var dbFunc = require('./mongoDb');
var config = require('../etc/config.json');
var web3 = new CONWeb3("http://" + config.TKRPCSVR + ":" + config.RPCPORT);
var coinbase = {};
var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './erc20_abi.json'), 'utf-8'));

//var sendconfig = require ("./private") ;
var Tx = require('ethereumjs-tx');
var mathFunc = require('./mathFunc')

coinbase.getCoinBalance = async function(req, callback) {
    //  console.log( " ADR " + req ) ;
    try {
        var balance = await web3.eth.getBalance(req);
    } catch (e) {
        callback("has error => " + e, null);
    }
    callback(null, balance);
    return balance;
} // END getCoinBalance


coinbase.getMultiCoinBalance = async function(req, res_name, res_adr, cout, callback) {
    // console.log( " ADR " + req ) ;
    var counter = cout;
    var rname = res_name;
    var radr = res_adr;
    try {
        var balance = await web3.eth.getBalance(req);
    } catch (e) {
        callback("has error =====> " + e, null, null, null, null);
    }
    callback(null, rname, radr, counter, balance);
    return true;
} // END getCoinBalance

coinbase.getTokenBalance = async function(reqAdress, reqToken, callback) {
    // console.log(`web3 version: ${web3.version}`)
    var myAddress = reqAdress;
    var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './erc20_abi.json'), 'utf-8'));
    var contractAddress = reqToken;
    // console.log ( "\n CONTRACT " + reqToken  + "\n\n"  ) ;
    var contract = new web3.eth.Contract(abiArray, contractAddress, {
        from: myAddress
    });
    try {
        var balance_of = await contract.methods.balanceOf(myAddress).call()
        callback(null, balance_of);
        return balance_of;
    } catch (e) {
        callback("has error =====> " + e, null);
        //  callback(null, balance_of);
        return balance_of;
    }

} // END getTokenBalance


coinbase.SignedSendCoin = async function(reqSendAdress, reqDestAdress, sendCrypt, ETsendAmount, callback) {
    console.log(`web3 version: ${web3.version}`);
    var myAddress = reqSendAdress;
    var destAddress = reqDestAdress;
    var count = await web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
    var privateKey = sendCrypt;
    console.log("Privatekey" + privateKey)
    var gasPriceGwei = 100;
    var gasLimit = 999000;
    var chainId = 9559;

    var tx = {
        "from": myAddress,
        "to": destAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
        "gasLimit": web3.utils.toHex(gasEatimate),
        "value": web3.utils.toWei(ETsendAmount, "ether"),
        "data": '0x',
        "chainId": chainId
    };

    console.log(`Raw of Transaction: \n privatekey : ${ privateKey } \n   \n${JSON.stringify(tx, null, '\t')}\n------------------------\n`);

    try {
        var receiptOut = web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
            const tran = web3.eth
                .sendSignedTransaction(signed.rawTransaction)
                .on('confirmation', (confirmationNumber, receipt) => {
                    if (confirmationNumber >= 24) {
                        console.log("  SignedSendCoin confirm : 24/" + confirmationNumber)
                    }

                })
                .on('transactionHash', hash => {
                    console.log('SignedSendCoin  TX HASH ' + hash);
                    // console.log(receipt);
                    callback(null, hash);
                    return true;
                })
                .on('receipt', receipt => {

                })
                .on('error', err => {
                    callback(util.inspect(err, false, null).substr(0, 70), null);
                    console.log(" SignedSendCoin ERR===========>" + err)
                    return false;

                });
        });


    } catch (err) {
        console.log(" ++++++++++++ Send Error  +++++++++++++++\n" + err);
        //     console.log ( err ) ;
        callback("send error" + err, null);
        return false;
    }
}


coinbase.SignedSendAsset = async function(reqSendAdress, reqDestAdress, reqTokenContract, sendCrypt, ETsendAmount, callback) {
    console.log(`web3 version: ${web3.version}`)
    var myAddress = reqSendAdress;
    var destAddress = reqDestAdress;
    var transferAmount = ETsendAmount;
    var count = await web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
    var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './erc20_abi.json'), 'utf-8'));
    //    var contractAddress = "0xf1d28bac210b14b75e6ce1d529a1221c17579bfe";
    var privateKey = sendCrypt;
    var contractAddress = reqTokenContract;
    var contract = new web3.eth.Contract(abiArray, contractAddress, {
        from: myAddress
    });
    var balance_bf = await contract.methods.balanceOf(myAddress).call();
    // console.log(`Balance before send: ${financialMfil(balance)} 2FL Token \n------------------------`);
    //  web3.utils.fromWei(customerBalance.add(customerRefundableEther)
    //    .sub(transactionFee).toString(), 'ether')
    //    console.log(`Balance before send: ` + mathFunc.numberWithCommas (web3.utils.fromWei( balance_bf.toString(),'ether')) +  ` 2FL Token \n------------------------`);
    var Txdata = contract.methods.transfer(destAddress, transferAmount).encodeABI(),
    balance = await contract.methods.balanceOf(myAddress).call();
    //console.log(`Balance after send: ${financialMfil(balance)} 2FL Token `);
    //
    // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
    var gasPriceGwei = 30;
     // var gasLimit = 999000;
    var chainId = 9559;
     try {
        var  gasEatimate = await  web3.eth.estimateGas( {"from": reqSendAdress , "to" : reqDestAdress ,"data" : TxData , "value": transferAmount   } );
     }catch (err) {
      callback ( "Error GasEstimate " , null ) 
      return 1 ;

  }
    var tx = {
        "from": myAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
        "gasLimit": web3.utils.toHex(gasEatimate ),
        "to": contractAddress,
        "value": "0x0",
        "data": TxData,
        "chainId": chainId
    };

    //  console.log(`Raw of Transaction: \n${JSON.stringify(tx, null, '\t')}\n------------------------`);

    try {
        var receiptOut = web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
            const tran = web3.eth
                .sendSignedTransaction(signed.rawTransaction)
                .on('confirmation', (confirmationNumber, receipt) => {
                    if (confirmationNumber >= 24) {
                        console.log('Send ' + destAddress + ' anomut : ' + web3.utils.fromWei(transferAmount, "ether") + '  => confirmation: 24/' + confirmationNumber);
                        return true;
                    }
                })
                .on('transactionHash', hash => {
                    console.log('=> hash');
                    console.log("TX hash : " + hash);
                })
                .on('receipt', receipt => {
                    console.log('=> reciept');
                    // console.log(" receipt confirmation 1/24 " + 'Send ' + destAddress + "  " + JSON.stringify(receipt, null, '\t'));
                    callback(null, receipt);
                    return true;
                })
                .on('error', error => {
                    callback(util.inspect(error, false, null).substr(0, 70), null);
                    return false;
                    // console.log("=============>" + util.inspect(error, false, null));
                    // onsole.log( JSON.stringify(error,null,'\t')  ) ; 
                });
        });


    } catch (err) {
        console.log(" ++++++++++++ Send Error  +++++++++++++++\n" + err);
        //     console.log ( err ) ;
        callback("send error" + err, null);
        return false;
    }
} // END  Expoert function


coinbase.SignedSendAssetV2 = async function(reqDestAdress, reqTokenContract, sendCrypt, ETsendAmount, callback, errorback) {
    var account = web3.eth.accounts.privateKeyToAccount(sendCrypt);
    console.log(`web3 version: ${web3.version}`)
    var myAddress = account.address;
    var destAddress = reqDestAdress;
    var transferAmount = ETsendAmount;
    var count = await web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
    var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './erc20_abi.json'), 'utf-8'));
    //    var contractAddress = "0xf1d28bac210b14b75e6ce1d529a1221c17579bfe";
    var privateKey = sendCrypt;
    var contractAddress = reqTokenContract;

    var contract = new web3.eth.Contract(abiArray, contractAddress, {
        "from": account.address
    });
    var TxData =  contract.methods.transfer(destAddress, transferAmount).encodeABI() ; 
    try {
        var  gasEatimate = await  web3.eth.estimateGas( {"from": myAddress , "to" : reqDestAdress ,"data" : TxData , "value": transferAmount   } );
     }catch (err) {
      callback ( "Error GasEstimate " , null ) 
      return 1 ;

  }

    //var balance_bf = await contract.methods.balanceOf(myAddress).call();
    // console.log(`Balance before send: ${financialMfil(balance)} 2FL Token \n------------------------`);
    //  web3.utils.fromWei(customerBalance.add(customerRefundableEther)
    //    .sub(transactionFee).toString(), 'ether')
    //    console.log(`Balance before send: ` + mathFunc.numberWithCommas (web3.utils.fromWei( balance_bf.toString(),'ether')) +  ` 2FL Token \n------------------------`);

    //balance = await contract.methods.balanceOf(myAddress).call();
    //console.log(`Balance after send: ${financialMfil(balance)} 2FL Token `);
    //
    // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
    var gasPriceGwei = 30;
    var gasLimit = gasEatimate;
    var chainId = 9559;
    var tx = {
        "from": account.address,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
        "gasLimit": web3.utils.toHex(gasLimit),
        "to": contractAddress,
        "value": "0x0",
        "data": TxData , 
        "chainId": chainId
    };

    //  console.log(`Raw of Transaction: \n${JSON.stringify(tx, null, '\t')}\n------------------------`);

    try {
        var receiptOut = web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
            const tran = web3.eth
                .sendSignedTransaction(signed.rawTransaction)
                .on('confirmation', (confirmationNumber, receipt) => {
                    if (confirmationNumber >= 24) {
                        console.log('Send ' + destAddress + ' anomut : ' + web3.utils.fromWei(transferAmount, "ether") + '  => confirmation: 24/' + confirmationNumber);
                        return true;
                    }
                })
                .on('transactionHash', hash => {
                    console.log('=> hash');
                    console.log("TX hash : " + hash);
                })
                .on('receipt', receipt => {
                    console.log('=> reciept');
                    // console.log(" receipt confirmation 1/24 " + 'Send ' + destAddress + "  " + JSON.stringify(receipt, null, '\t'));
                    callback(null, receipt);
                    return true;
                })
                .on('error', error => {
                    errorback(" \n" + util.inspect(error, false, null).substr(0, 70), null);
                    return false;
                    // console.log("=============>" + util.inspect(error, false, null));
                    // onsole.log( JSON.stringify(error,null,'\t')  ) ; 
                });
        });


    } catch (err) {
        console.log(" ++++++++++++ Send Error  +++++++++++++++\n" + err);
        //     console.log ( err ) ;
        errorback("\nsend error " + err, null);
        return false;
    }
} // END  Ex


coinbase.sendAsset = async function(reqSendAdress, reqDestAdress, reqTokenContract, sendCrypt, sendAmount, callback) {
    console.log(`web3 version: ${web3.version}`)
    var myAddress = reqSendAdress;
    var destAddress = reqDestAdress;
    var transferAmount = sendAmount;
    var count = await web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
    var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './erc20_abi.json'), 'utf-8'));
    //    var contractAddress = "0xf1d28bac210b14b75e6ce1d529a1221c17579bfe";
    var contractAddress = reqTokenContract;
    var contract = new web3.eth.Contract(abiArray, contractAddress, {
        from: myAddress
    });
    //var balance_bf = await contract.methods.balanceOf(myAddress).call();
    // console.log(`Balance before send: ${financialMfil(balance)} 2FL Token \n------------------------`);
    //  web3.utils.fromWei(customerBalance.add(customerRefundableEther)
    //    .sub(transactionFee).toString(), 'ether')
    //    console.log(`Balance before send: ` + mathFunc.numberWithCommas (web3.utils.fromWei( balance_bf.toString(),'ether')) +  ` 2FL Token \n------------------------`);

    //balance = contract.methods.balanceOf(myAddress).call();
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
    var privKey = new Buffer(sendCrypt, 'hex');
    var tx = new Tx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`);
    try {
        var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
        callback(null, receipt);
        console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`);
        return true;
    } catch (err) {
        console.log(" ++++++++++++ Send Error  +++++++++++++++\n");
        //     console.log ( err ) ;
        callback("send error" + err, null);
        return false;
    }

    //   callback(null, receipt);
    //balance = await contract.methods.balanceOf(myAddress).call();
    //  console.log(`Balance before send: ` + mathFunc.numberWithCommas (web3.utils.fromWei( balance_bf.toString(),'ether')) +  ` 2FL Token `);
    // console.log(`Balance  after send: ` + mathFunc.numberWithCommas (web3.utils.fromWei( balance.toString(),'ether')) +  `  2FL Token `);
}

coinbase.CreateAsset = function(_password, callback) {
    var CoinAddr = web3.eth.accounts.create(_password);
    var TokenAddr = web3.eth.accounts.create(_password);
    var assets = { CoinAddr, TokenAddr };
    // console.log (JSON.stringify(assets, null, '\t')) ; 
    try {
        web3.eth.accounts.wallet.add(CoinAddr.privateKey);
        web3.eth.accounts.wallet.add(TokenAddr.privateKey);
        callback(null, assets);
        return true;
    } catch (e) {
        callback(e, null);
        callback("error : " + e, null);
        return error;
    }

}

coinbase.allowance = async function(_owner, _spender, _contract, callback) {
    console.log(" Hello allowance ====== :");
    var contract = new web3.eth.Contract(abiArray, _contract, {
        from: _owner,
        gasPrice: '20000000000'
    });
    try {
        var allowance = await contract.methods.allowance(_owner, _spender).call();
        callback(null, allowance);
        return true;
    } catch (e) {
        console.log("Error catch allowance :\n" + e)
        callback("Error : allowance " + e, null);
        return false;
    }
}

coinbase.approve = async function(_owner, _spender, _contract, _Evalue, _privatekey, callback) {
    console.log("====Hello Approve ===");
    var contract = new web3.eth.Contract(abiArray, _contract);
    const value = web3.utils.toWei(_Evalue, "ether")
    const query = contract.methods.approve(_spender, value);
    const encodedABI = query.encodeABI();
    const gasLimit = 4712388;
    const gas = 50000;
    const gasPrice = 1000 * 1e9; // convert string to number when multiply 
    // var gasPriceGwei = 2;
    // var gasLimit = 4000000;
    var chainId = 9559;
    //  console.log("Value : " + value)
    var count = await web3.eth.getTransactionCount(_owner);
    const tx = {
        from: _owner,
        to: _contract,
        "gasPrice": web3.utils.toHex(gasPrice),
        "gasLimit": web3.utils.toHex(gasLimit),
        "gas": web3.utils.toHex(gas),
        data: encodedABI,
        "chainId": chainId,
        // nonce: web3.utils.toHex(count + 1)
    };
    // const account = web3.eth.accounts.privateKeyToAccount(_privatekey);
    // web3.eth.getBalance(_owner).then(console.log); 
    // tx.nonce = web3.utils.toHex(count + 1); // record update serial transaction count 
    try {
        web3.eth.accounts.signTransaction(tx, _privatekey).then(signed => {
            var rxcount = 0;
            const tran = web3.eth
                .sendSignedTransaction(signed.rawTransaction)
                .on('confirmation', (confirmationNumber, receipt) => {
                    if (confirmationNumber >= 24) {
                        console.log('=> approve signTransaction confirmation: 24/' + confirmationNumber);
                        console.log("\n callback approve OK ===> ");
                        callback(null, receipt);
                        return true;
                    }
                })
                .on('transactionHash', hash => {
                    // console.log('=> hash');
                    // console.log(hash);
                })
                .on('receipt', receipt => {
                    //console.log('=> reciept ' + rxcount++  );
                    //  console.log(receipt); 
                    // console.log("\n callback approve OK ===> ");
                    // callback(null, receipt);
                    return true;
                })
                .on('error', error => {
                    console.log("\n callback approve error ===> " + error)
                    callback("Error : " + error, null);
                    return;

                });
        });
    } catch (e) {
        console.log("error" + e)
        callback("Approve Error :  " + e, receipt);
        return false;
    }
}; //End Approve

coinbase.transferFrom = async function(_from, _to, _contract, _Sender_PrivateKey, _Evalue, callback) {

    // web3.eth.getTransaction(pending_txn_hash).gasPrice

    var account = web3.eth.accounts.privateKeyToAccount(_Sender_PrivateKey);
    console.log(" |   IN TRANSFERFORM  | \nSpender : " + account.address + "\nFROM: " + _from + "\nTO: " + _to + "\nAmounts  : " + _Evalue +
        "\nContract : " + _contract + "\nKEY: " + account.privateKey);
    var contract = new web3.eth.Contract(abiArray, _contract);
    const value = web3.utils.toWei(_Evalue, "ether")
    const query = contract.methods.transferFrom(_from, _to, value);
    const encodedABI = query.encodeABI();
    // const block = async function ( ) {
    //               var block =   await web3.eth.getBlock("latest") ;
    //               console.log ( JSON.stringify( block )) ; 
    //               return block ; 
    //     } 
    const gasLimit = 4712388;
    const gas = 50000;
    const gasPrice = 1000 * 1e9; // convert string to number when multiply 
    // console.log ( util.inspect(block, false, null).substr(0, 70), null ) ;
    console.log(" Transfer from : " + gasPrice + " Gas limit  " + gasLimit);
    //var gasPriceGwei = 2;
    //var gasLimit = 4000000;
    var chainId = 9559;
    //  console.log("Value : " + value)
    var count = await web3.eth.getTransactionCount(account.address);
    const tx = {
        from: account.address,
        to: _contract,
        "gasPrice": web3.utils.toHex(gasPrice),
        "gasLimit": web3.utils.toHex(gasLimit),
        "gas": web3.utils.toHex(gas),
        data: encodedABI,
        "chainId": chainId,
        //"nonce": "0x" + count.toString(16)
    };
    try {
        let doTransac = web3.eth.accounts.signTransaction(tx, account.privateKey).then(signed => {
            const tran = web3.eth
                .sendSignedTransaction(signed.rawTransaction)
                .on('error', (error) => {
                    console.log("Transfer Error ===> : " + error);
                    callback("Error " + error, {
                        "receive": null,
                        "reserror": error
                    });
                    return false;
                })
                .then((receipt) => {
                    console.log('=> TX hash');
                    console.log("  recevice  THEN :  " + receipt.transactionHash);
                    callback(null, {
                        "receive": receipt.transactionHash,
                        "reserror": null
                    });
                    return true;
                })
        });
    } catch (e) {
        console.log("error" + e)
        console.log("Transfer Error catch===> : " + e);
        callback("Error transfer from" + e, null);
        return false
    }
}; //End Approve


coinbase.transferFromV2 = async function(_from, _to, _contract, _Sender_PrivateKey, _Evalue, callback) {

    // web3.eth.getTransaction(pending_txn_hash).gasPrice


    var account = web3.eth.accounts.privateKeyToAccount(_Sender_PrivateKey);
    console.log(" |   IN TRANSFERFORM  V II | \nSpender : " + account.address + "\nFROM: " + _from + "\nTO: " + _to + "\nAmounts  : " + _Evalue +
        "\nContract : " + _contract + "\nKEY: " + account.privateKey);
    var contract = new web3.eth.Contract(abiArray, _contract);
    const value = web3.utils.toWei(_Evalue, "ether")
    const query = contract.methods.transferFrom(_from, _to, value);
    const encodedABI = query.encodeABI();
    // const block = async function ( ) {
    //               var block =   await web3.eth.getBlock("latest") ;
    //               console.log ( JSON.stringify( block )) ; 
    //               return block ; 
    //     } 
    const gasLimit = 4712388;
    const gas = 50000;
    const gasPrice = 1000 * 1e9; // convert string to number when multiply 
    // console.log ( util.inspect(block, false, null).substr(0, 70), null ) ;
    console.log(" Transfer from : " + gasPrice + " Gas limit  " + gasLimit);
    //var gasPriceGwei = 2;
    //var gasLimit = 4000000;
    var chainId = 9559;
    //  console.log("Value : " + value)
    var count = await web3.eth.getTransactionCount(account.address);
    const tx = {
        from: account.address,
        to: _contract,
        "gasPrice": web3.utils.toHex(gasPrice),
        "gasLimit": web3.utils.toHex(gasLimit),
        "gas": web3.utils.toHex(gas),
        data: encodedABI,
        "chainId": chainId,
        //"nonce": "0x" + count.toString(16)
    };


    // try {
    //     setTimeout(() => {
    //         throw new Error("Uh oh!");
    //     }, 2000);
    // } catch (e) {
    //     console.log("I caught the error: " + e.message);
    // }

    try {
        setTimeout(() => {
            let doTransac = web3.eth.accounts.signTransaction(tx, account.privateKey).then(signed => {
                const tran = web3.eth
                    .sendSignedTransaction(signed.rawTransaction)
                    .on('error', (error) => {
                        console.log("Transfer Error ===> : " + error);
                        callback("Error " + error, {
                            "receive": null,
                            "reserror": error
                        });
                        return false;
                    })
                    .then((receipt) => {
                        console.log('=> TX hash');
                        console.log("  recevice  THEN :  " + receipt.transactionHash);
                        callback(null, {
                            "receive": receipt.transactionHash,
                            "reserror": null
                        });
                        return true;
                    })
            });
        }, 10000);
    } catch (e) {
        console.log("error" + e)
        console.log("Transfer Error catch===> : " + e);
        callback("Error transfer from" + e, null);
        return false
    }
}; //End Approve






exports.coinbase = coinbase // Method
