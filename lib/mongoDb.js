/*
 * This file Create by Anan P.
 * create date 1 June 2018
 */
// web3.eth.getBalance(contract.address)
var autoIncrement = require("mongodb-autoincrement");
var MongoClient = require('mongodb').MongoClient,
    format = require('util').format;
var config = require('../etc/config.json');
// var web3 = require('./token1.js');
var coinFunc = require('./coinfunction');
// coinFunc.coinbase.getCoinBalance ( reqAddr, res );
// coinFunc.coinbase.getTokenBalance (reqAddr,contract,res)

const util = require('util'); // tool for view [object to JSON ]
var path = require('path');
//  Conniting ETH
var CONWeb3 = require('web3');
var web3 = new CONWeb3("http://" + config.RPCSVR + ":" + config.RPCPORT);
// test web3 console.log (web3.utils.fromWei( "3423837732949323425392388453453222",'ether') ) ;
var url = "mongodb://" + config.mongoDB.user + ":" + config.mongoDB.password + "@" + config.mongoDB.serverIp + ":27017/";
var obj = {}; // Main defind

obj.findTransactions = function(OwnerID, callback) {
    if (!OwnerID) return;
    MongoClient.connect(url, function(err, db) {
        var x, coldata = "";
        if (err) {
            callback(err, null);
            return false;
        };
        var dbo = db.db("transactions");
        var query = ({
            "ownerid": OwnerID
        });
        //console.log ( JSON.stringify( query , null , '\t'  ) )  ;
        var PromiseResolve = [];
        dbo.collection("historyrecords").find(query).sort({ "datetime": -1 }).toArray(function(err, res) {

            if (err) {
                db.close();
                console.log(JSON.stringify(err, null, '\t'));
                return err
            };
            db.close();
            //  console.log ( JSON.stringify( res , null , '\t'  ) )  ;
            callback(null, res); // callback  Return
            return true;
        }); // END dbo
    }); //END MongoClient.connect
} // END find Transactions

obj.findDepAddr = function(OwnerID, callback) {
    if (!OwnerID) return;
    var data = "";
    MongoClient.connect(url, function(err, db) {
        var x, coldata = "";
        if (err) {
            callback(err, null);
            return false;
        };
        var dbo = db.db("asset");
        var query = ([{
                '$lookup': {
                    "from": "coins",
                    "localField": "ownerid",
                    "foreignField": "ownerid",
                    "as": "coin_doc"
                }
            },
            {
                "$lookup": {
                    "from": "tokens",
                    "localField": "ownerid",
                    "foreignField": "ownerid",
                    "as": "token_doc"
                }
            },
            {
                "$match": {
                    "ownerid": OwnerID
                }
            }
        ]);
        //console.log ( "      " + JSON.stringify( query  )   ) ;
        var PromiseResolve = [];
        dbo.collection("owners").aggregate(query).toArray(function(err, res) {
            if (err) { db.close(); return err };
            db.close();
            var x, y = "";
            for (x in res) {
                //       console.log ( " x = " + x ) ;
                if (res[x].coin_doc) {
                    for (y in res[x].coin_doc) {
                        //  console.log ( " coin y = " + y ) ;
                        PromiseResolve.push({
                            "depName": res[x].coin_doc[y].coinName,
                            "depAddr": res[x].coin_doc[y].coinAddr
                        });
                        // console.log ( " ==>   " + res[x].coin_doc[y].coinName + " Coin ADDR  "  + res[x].coin_doc[y].coinAddr    )  ;
                    } // INNER FOR
                } // 1ft IF
                if (res[x].token_doc) {
                    for (y in res[x].token_doc) {
                        //  console.log ( " token y = " + y ) ;
                        PromiseResolve.push({
                            "depName": res[x].token_doc[y].tokenName,
                            "depAddr": res[x].token_doc[y].tokenAddr
                        });
                        //   console.log ( " ==>   " + res[x].token_doc[y].tokenName + " Token ADDR  "  + res[x].token_doc[y].tokenAddr    )  ;
                    } // INNER FOR
                } // End 2nd if
            } // End 1ft for
            callback(null, PromiseResolve); // Return
            return true;
        }); // END dbo
    }); //END MongoClient.connect
} // END find deposit


obj.coinsBalance = function(userid, callback) {
    if (!userid) return;
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("asset");
        var query = {
            "ownerid": userid
        };
        //      var balance = await  web3.eth.getBalance( "0x82378cf137F5dF4FA730529eB79a4583EA605FA9" ) ;
        //      console.log ("Balance :" + JSON.stringify( balance )   ) ;
        //      console.log (web3.utils.fromWei( "3423837732949323425392388453453222",'ether') ) ;
        dbo.collection("coins").find(query).toArray(function(err, result) {
            var i = "";
            var coinAddr, ownerid = "";
            var promiseResolve = [];
            //              console.log ( " result " + JSON.stringify ( result ) ) ;
            //              if ( result.length == 0  ) console.log ( " result == Nothing  " + JSON.stringify ( result ) ) ;
            if (err) { return err };
            if (result.length > 0) {;
                if (result[0].coinAddr) coinAddr = result[0].coinAddr;
                if (result[0].ownerid) ownerid = result[0].ownerid;
                if (result[0].coinName) coinName = result[0].coinName;
                coinFunc.coinbase.getCoinBalance(coinAddr, function(err, res) {
                    if (err == null) {
                        promiseResolve.push({
                            "ownerid": ownerid,
                            "coinAddr": coinAddr,
                            "coinName": coinName,
                            "coinBalance": res
                        });
                    } else {
                        console.log("Error : " + err);
                    } //
                    callback(null, promiseResolve);
                }); // End coin Func
                return true;
            }
            if (result.length == 0) {

                callback("Error", []);
                return false;
            };
        }); //
    }); //
} /* End coinsBalance  */

obj.tokensBalance = function(userid, callback) {
    if (!userid) return;
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("asset");
        var query = {
            "ownerid": userid
        };
        dbo.collection("tokens").find(query).toArray(function(err, result) {
            if (err) return err;
            if (result.length == 0) return [];
            var promiseResolve = [];
            tokenAddr = result[0].tokenAddr;
            ownerid = result[0].ownerid;
            tokenName = result[0].tokenName;
            contractAddr = result[0].contractAddr;
            cryptkey = result[0].cryptkey;
            // console.log ( "CONTRACT " + contractAddr + " \n\n " )   ;
            coinFunc.coinbase.getTokenBalance(tokenAddr, contractAddr, function(err, res) { //
                if (err == null) {
                    promiseResolve.push({
                        "ownerid": ownerid,
                        "tokenAddr": tokenAddr,
                        "tokenName": tokenName,
                        "contractAddr": contractAddr,
                        "cryptkey": cryptkey,
                        "tokenBalance": res
                    });
                } else {
                    console.log("Error : " + err);
                } /* End if err */
                callback(null, promiseResolve);
            }); // End coin Func
            // callback ( null , result  ) ;
            return;
        }); //
    }); //
} // End

obj.PairChkTokens = function(userid, senderaddr, destaddr, contractid, amount, webparse, callback) {
    //  console.log ( " HELLO COME TO SENDTOKEN " + destaddr + "  " + destaddr ) ;
    if (!userid) return;
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("asset");
        var query = {
            "ownerid": userid,
            "tokenAddr": senderaddr,
            "contractAddr": contractid,
        };
        dbo.collection("tokens").find(query).toArray(function(err, result) {
            if (err) return err;
            if (result.length == 0) return [];
            var promiseResolve = [];
            tokenAddr = result[0].tokenAddr;
            ownerid = result[0].ownerid;
            tokenName = result[0].tokenName;
            contractAddr = result[0].contractAddr;
            cryptkey = result[0].cryptkey;
            //console.log ( "CONTRACT " + contractAddr + " \n\n " )   ;
            coinFunc.coinbase.getTokenBalance(tokenAddr, contractAddr, function(err, res) { //
                if (err == null) {
                    promiseResolve.push({
                        "ownerid": ownerid,
                        "tokenAddr": tokenAddr,
                        "tokenName": tokenName,
                        "contractAddr": contractAddr,
                        "cryptkey": cryptkey,
                        "tokenBalance": res
                    });
                } else {
                    //   console.log ( "Error : " + err ) ;
                } /* End if err */
                callback(null, promiseResolve);
            }); // End coin Func
            // callback ( null , result  ) ;
            return;
        }); //
    }); //
} // End

obj.insertTransac = function(datetime, ownerid, cryptoname, txaddress, rxaddress,
    value, netfee, contract, txhash, transacdata, massage, callback) {
    if (!ownerid) return;
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("transactions");
        var doccollet = "historyrecords";
        autoIncrement.getNextSequence(dbo, doccollet, function(err, autoIndex) {
            var collection = dbo.collection(doccollet);
            collection.insert({
                "transacId": autoIndex,
                "datetime": datetime,
                "ownerid": ownerid,
                "cryptoname": cryptoname,
                "txaddress": txaddress,
                "rxaddress": rxaddress,
                "value": value,
                "netfee": netfee,
                "contract": contract,
                "txhash": txhash,
                "transacdata": transacdata,
                "massage": massage
            });
            if (err == null) callback(null, "OK");
            return;
        });

    });
} // End Transactions 

obj.insertReg = function(uname, fname, lname, email, birth, pass, twoFA, twofaEnable, firstlogin, callback) {
    if (!uname) return;
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("accounts");
        var doccollet = "registor";
        autoIncrement.getNextSequence(dbo, doccollet, function(err, autoIndex) {
            var collection = dbo.collection(doccollet);
            collection.insert({
                "userid": autoIndex,
                "userlogin": uname,
                "firstname": fname,
                "lastname": lname,
                "email": email,
                "birth": birth,
                "password": pass,
                "twoFA": twoFA,
                "twofaEnable": twofaEnable,
                "firstLogin": firstlogin
            });
            db.close();
            if (err == null) callback(null, "OK");
            return;
        });

    });
} // End insert

obj.insertAssets = function(_password, _ownerID, callback) {
    if (!_ownerID || !_password) return;
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("asset");
        var dboAcc = db.db("accounts");
        var doccolletC = "coins";
        var doccolletT = "tokens";
        var doccolletW = "owners";

        coinFunc.coinbase.CreateAsset(_password, function(err, asRes) {
            console.log("RED COIN RES : " + JSON.stringify(asRes, null, '\t'));
            if (err == null) {
                try {


                    autoIncrement.getNextSequence(dbo, doccolletT, function(err, TautoIndex) {
                        var collectionT = dbo.collection(doccolletT);
                        collectionT.insert({
                            "tokenId": TautoIndex,
                            "tokenName": "2COIN",
                            "coinSymbolId": 2,
                            "ownerid": _ownerID,
                            "cryptkey": asRes.TokenAddr.privateKey,
                            "tokenAddr": asRes.TokenAddr.address,
                            "contractAddr": "0xa70a8d416c22e5817323f2cebf233d929e5722a1"
                        });
                    });

                } catch (e) {
                    if (e) {
                        db.close();
                        callback(" Error add token " + e, null);
                        return false;
                    };
                }


                try {

                    autoIncrement.getNextSequence(dbo, doccolletC, function(err, CautoIndex) {
                        var collectionC = dbo.collection(doccolletC);
                        collectionC.insert({
                            "coinId": CautoIndex,
                            "coinName": "FEN",
                            "coinSymbolId": 1,
                            "ownerid": _ownerID,
                            "cryptkey": asRes.CoinAddr.privateKey,
                            "coinAddr": asRes.CoinAddr.address,
                        });
                    });
                } catch (e) {
                    if (e) {
                        db.close();
                        callback(" Error add coin " + e, null);
                        return false;
                    };
                }


                try {
                    var collectionW = dbo.collection(doccolletW);
                    collectionW.insert({
                        "ownerid": _ownerID
                    });
                } catch (e) {
                    if (e) {
                        db.close();
                        callback(" Error add coin " + e, null);
                        return false;
                    };
                }


                try {
                    //  Reset flag first login
                    var uquery = { "userid": _ownerID };
                    var newvalue = { $set: { "firstLogin": false } };

                    dboAcc.collection("registor").update(uquery, newvalue, function(err, result) {
                        //     console.log(" UPDATE flag data ---> " + JSON.stringify(uquery) + "\n" + JSON.stringify(newvalue) + "\n" + JSON.stringify(result, null, '\t'));
                        if (err) {
                            //   console.log("ERROR  : " + err);
                            callback("Error" + err, null);

                        } else if (result) {

                            callback(null, result);
                            // console.log ( "send result") ; 

                        } else {
                            callback(null, { "update": "OK" });
                            console.log("Update flag first login OK");
                        }
                    });
                } catch (e) {
                    if (e) {
                        db.close();
                        callback(" Error add coin " + e, null);
                        return false;
                    };
                }


            };
            if (err == null) {
                callback(null, " OK ");
                return true
            } else {
                callback("Error connection db", null);
                return false;
            };
        });

    });
} // End insert

obj.insertLoginUser = function(uname, fname, lname, email, birth, pass, callback) {
    if (!userId) return;
    var txt = "";
    MongoClient.connect(url, function(err, db) {
        var x = "";
        if (err) {
            callback(err, null);
        };
        var dbo = db.db("accounts");
        var inputData = {
            "userid": "  ",
            "userlogin": uname,
            "firstname": fname,
            "lastname": lname,
            "email": email,
            "birth": birth,
            "password": pass

        };
        let respdb;
        dbo.collection("registor").insert(inputData, function(err, result) {
            if (err) return err;
            db.close();
            txt = "OK";
            callback(null, "OK"); // Return
            return txt;
        }); // END dbo
    }); //END MongoClient.connect
    //  }) //
} // END insert user

obj.insertSession = function(userId, sess, uxtime, ipaddr, callback) {
    if (!userId) return;
    var txt = "";
    MongoClient.connect(url, function(err, db) {
        var x = "";
        if (err) {
            callback(err, null);
        };
        var dbo = db.db("webserv");
        var inputData = {
            "accountId": userId,
            "sessionId": sess,
            "unixtime": uxtime,
            "ipaddr": ipaddr

        };
        let respdb;
        dbo.collection("sessions").insert(inputData, function(err, result) {
            if (err) return err;
            db.close();
            txt = "OK";
            callback(null, "OK"); // Return
            return txt;
        }); // END dbo
    }); //END MongoClient.connect
} // END insert Session

obj.findSession = function(accID, callback) {
    if (!accID) return;
    var data = "";
    MongoClient.connect(url, function(err, db) {
        var x, coldata = "";
        if (err) {
            callback(err, null);
        };
        var dbo = db.db("webserv");
        var query = { accountId: accID };
        let respdb;
        dbo.collection("sessions").find(query).toArray(function(err, result) {
            if (err) return err;
            db.close();
            callback(null, result); // Return
        }); // END dbo
    }); //END MongoClient.connect
} // END finduser

obj.enableTwoFA = function(userid, callback) {
    // console.log ( "AAAAA") ; 

    if (!userid) return;
    MongoClient.connect(url, function(err, db) {

        if (err) {
            callback("Connected db Error", null);
            return fales;
        };
        var dbo = db.db("accounts");

        var query = { "userid": userid };
        var newvalue = { $set: { "twofaEnable": true } };

        dbo.collection("registor").update(query, newvalue, function(err, result) {
            /// console.log(" UPDATE data ---> " + JSON.stringify(result, null, '\t'));
            if (err) {
                //   console.log("ERROR  : " + err);
                callback("Error" + err, null);

            } else if (result) {

                callback(null, result);
                // console.log ( "send result") ; 

            } else {
                callback(null, { "update": "OK" });
                // console.log ( "send OK") ;
            }
        });
    });
};

obj.findTwoFA = function(userid, callback) {
    if (!userid) return;
    var data = "";
    MongoClient.connect(url, function(err, db) {
        var x, coldata = "";
        if (err) {
            callback(err, null);
        };
        var dbo = db.db("accounts");
        var query = { "userid": userid };
        let respdb;
        try {
            dbo.collection("registor").find(query).toArray(function(err, result) {
                if (err) return err;
                db.close();
                var ret_data = {
                    "email": result[0].email,
                    "twoFA": result[0].twoFA,
                    "twofaEnable": result[0].twofaEnable,
                    "firstname": result[0].firstname,
                    "lastname": result[0].lastname,
                    "userlogin": result[0].userlogin,
                };
                if (!result[0].twofaEnable) ret_data.twofaEnable = false;
                //console.log(" REULT " + JSON.stringify(result, null, '\t'))
                callback(null, ret_data);
                return;
            }); // END dbo
        } catch (e) {
            callback("Error Connection db Error " + e, null);
        }

    }); //END MongoClient.connect
} // END finduser

obj.finduser = function(quser, callback) {
    if (!quser) return;
    var txt = "";
    MongoClient.connect(url, function(err, db) {
        var x = "";
        if (err) {
            callback(err, null);
        };
        var dbo = db.db("accounts");
        var query = { userlogin: quser };
        let respdb;
        dbo.collection("users").find(query).toArray(function(err, result) {
            if (err) return err;
            txt += "<table border=#1 >";
            txt += "<tr><td>IDCard Number" +
                "</td><td>Userlogin" +
                "</td><td>FirstName" +
                "</td><td>Lastname" +
                "</td><td> Email </td></tr>\n";
            for (x in result) {
                txt += "<tr><td>" + result[x].IDcardpass +
                    "</td><td>" + result[x].userlogin +
                    "</td><td>" + result[x].firstname +
                    "</td><td>" + result[x].lastname +
                    "</td><td>" + result[x].email + "</td></tr>\n";
            }
            txt += "</table>";
            db.close();
            callback(null, txt); // Return
        }); // END dbo
    }); //END MongoClient.connect
} // END finduser

obj.regExisting = function(chkUser, chkEmail, callback) {
    if (!chkUser) return;
    MongoClient.connect(url, function(err, db) {
        var x, txt = "";
        if (err) {
            console.log(" Cilent error ");
            callback(err, null);
        };
        if (db != null) {
            var dbo = db.db("accounts");
            var query = ({
                $or: [
                    { "userlogin": chkUser },
                    { "email": chkEmail }
                ]
            }); //

            let respdb;
            try {
                dbo.collection("registor").find(query).toArray(function(err, result) {
                    if (result == '') {
                        // console.log ( "Exisiting  : nothing  OK FOR registor new user"  ) ;
                        callback(null, {
                                answer: {
                                    "userlogin": null,
                                    "email": null,
                                    "stat": "notthing",
                                    "error": null
                                } //
                            } //
                        );
                        db.close();
                        return false; //  Must be here
                    }
                    if (err) {
                        callback("Error", {
                                answer: {
                                    "userlogin": null,
                                    "email": null,
                                    "stat": "error",
                                    "error": err
                                } //
                            } //
                        );
                        db.close();
                        return false; //  Must be here
                    }
                    if (!result == '') {
                        //console.log( "password test [0] " +result[0].password);
                        //console.log( "password ---> right : " +result ) ;
                        for (x in result) {
                            console.log("Existing user : " + result[0].userlogin);
                            callback(null, {
                                    answer: {
                                        "userlogin": result[0].userlogin,
                                        "email": result[0].email,
                                        "stat": "exisiting",
                                        "error": null
                                    } //
                                } //
                            );
                        } //  End if err
                        db.close();
                    } //
                }); // END dbo
            } /* end try */
            catch (e) {
                callback("Catch Error", {
                        answer: {
                            "userlogin": null,
                            "email": null,
                            "stat": "error",
                            "error": e
                        } //
                    } //
                );
                console.log("Error catch \n" + e);
                return false; //  Must be here
            } /* End catch */
        };

    }); //END MongoClient.connect
}; // END chkpass

obj.userExisting = function(chkID, chkUser, chkEmail, chkFname, chkLname, callback) {
    if (!chkID) return;
    MongoClient.connect(url, function(err, db) {
        var x, txt = "";
        if (err) {
            console.log(" Cilent error ");
            callback(err, null);
        };
        if (db != null) {
            var dbo = db.db("accounts");
            var query = ({
                $or: [{ $and: [{ "firstname": chkFname }, { "lastname": chkLname }] },
                    { "userlogin": chkUser },
                    { "email": chkEmail },
                    { "IDcardpass": chkID }
                ]
            }); //

            let respdb;
            try {
                dbo.collection("users").find(query).toArray(function(err, result) {
                    if (result == '') {
                        console.log("Exisiting  : nothing ");
                        callback(null, {
                            answer: {
                                "userlogin": null,
                                "email": null,
                                "stat": "notthing",
                                "error": null
                            }
                        });
                        db.close();
                        return false; //  Must be here
                    }
                    if (err) {
                        callback("Error", {
                            answer: {
                                "userlogin": null,
                                "email": null,
                                "stat": "error",
                                "error": err
                            }
                        });
                        db.close();
                        return false; //  Must be here
                    }
                    if (!result == '') {
                        //console.log( "password test [0] " +result[0].password);
                        //console.log( "password ---> right : " +result ) ;
                        for (x in result) {
                            console.log("Existing user : " + result[0].userlogin);
                            callback(null, {
                                answer: {
                                    "userlogin": result[0].userlogin,
                                    "email": result[0].password,
                                    "stat": "exisiting",
                                    "error": null
                                }
                            });
                        } //  End if err
                        db.close();
                    } //
                }); // END dbo
            } /* end try */
            catch (e) {
                callback("Catch Error", {
                    answer: {
                        "userlogin": null,
                        "email": null,
                        "stat": "error",
                        "error": e
                    }
                });
                console.log("Error catch \n" + e);
                return false; //  Must be here

            } /* End catch */
        };

    }); //END MongoClient.connect
}; // END chkpass

obj.idChkPass = function(iDchk, callback) {
    if (!iDchk) return;
    MongoClient.connect(url, function(err, db) {
        var x, txt = "";
        if (err) {
            console.log(" Cilent error ");
            callback(err, null);
        };
        if (db != null) {
            var dbo = db.db("accounts");
            var query = { userid: iDchk };
            let respdb;
            try {
                dbo.collection("registor").find(query).toArray(function(err, result) {
                    if (result == '') {
                        callback(null, {
                            answer: {
                                "objid": null,
                                "userid": null,
                                "userlogin": null,
                                "password": null,
                                "stat": "found",
                                "error": null
                            }
                        });
                        db.close();
                        return false; //  Must be here
                    }
                    if (err) {
                        callback("Error", {
                            answer: {
                                "objid": null,
                                "userid": null,
                                "userlogin": null,
                                "password": null,
                                "stat": "error",
                                "error": err
                            }
                        });
                        db.close();
                        return false; //  Must be here
                    }
                    if (!result == '') {
                        //console.log( "password test [0] " +result[0].password);
                        //console.log( "password ---> right : " +result ) ;
                        callback(null, {
                            answer: {
                                "objid": result[0]._id,
                                "userid": result[0].userid,
                                "userlogin": result[0].userlogin,
                                "password": result[0].password,
                                "stat": "found",
                                "error": null
                            }
                        });
                    } //  End if err
                    db.close();

                }); // END dbo
            } /* end try */
            catch (e) {
                callback("Catch Error", {
                    answer: {
                        "objid": null,
                        "userid": null,
                        "userlogin": null,
                        "password": null,
                        "stat": "error",
                        "error": e
                    }
                });
                console.log("Error catch \n");
                return false; //  Must be here

            } /* End catch */
        };

    }); //END MongoClient.connect
}; // END chkpass

obj.Regchkpass = function(chkUser, callback) {
    if (!chkUser) return;
    MongoClient.connect(url, function(err, db) {
        var x, txt = "";
        if (err) {
            console.log(" Cilent error ");
            callback(err, null);
        };
        if (db != null) {
            var dbo = db.db("accounts");
            var query = { userlogin: chkUser };
            let respdb;
            try {
                dbo.collection("registor").find(query).toArray(function(err, result) {
                    if (result == '') { // result Nothing 
                        callback(null, {
                            answer: {
                                "objid": null,
                                "userid": null,
                                "userlogin": null,
                                "password": null,
                                "stat": null,
                                "enaTFA": null,
                                "error": null,
                                "firstLogin": null
                            }
                        });
                        db.close();
                        return false; //  Must be here
                    }
                    if (err) {
                        callback("Error", {
                            answer: {
                                "objid": null,
                                "userid": null,
                                "userlogin": null,
                                "password": null,
                                "stat": "error",
                                "enaTFA": null,
                                "error": err,
                                "firstLogin": null
                            }
                        });
                        db.close();
                        return false; //  Must be here
                    }
                    if (!result == '') { //  result has value 
                        //console.log( "password test [0] " +result[0].password);
                        //console.log( "password ---> right : " +result ) ;
                        callback(null, {
                            answer: {
                                "objid": result[0]._id,
                                "userid": result[0].userid,
                                "userlogin": result[0].userlogin,
                                "password": result[0].password,
                                "stat": "found",
                                "enaTFA": result[0].twofaEnable,
                                "error": null,
                                "firstLogin": result[0].firstLogin
                            }
                        });
                    } //  End if err
                    db.close();

                }); // END dbo
            } /* end try */
            catch (e) {
                callback("Catch Error", {
                    answer: {
                        "objid": null,
                        "userid": null,
                        "userlogin": null,
                        "password": null,
                        "stat": "error",
                        "error": e,
                        "firstLogin": null
                    }
                });
                console.log("Error catch \n");
                return false; //  Must be here

            } /* End catch */
        };

    }); //END MongoClient.connect
}; // END chkpass

obj.updateuser = function(uUser) {
    return " Update user :" + uUser;
};
obj.deleteuser = function(uUser) {
    return " Delete user :" + uUser;
};
var hello = function(hUser) {
    return "Hello " + hUser;
}

exports.data = obj; // Method
exports.hello = hello; // Var
//exports.finduser=finduser ; // Var


obj.userExisting = function(chkID, chkUser, chkEmail, chkFname, chkLname, callback) {
    if (!chkID) return;
    MongoClient.connect(url, function(err, db) {
        var x, txt = "";
        if (err) {
            console.log(" Cilent error ");
            callback(err, null);
        };
        if (db != null) {
            var dbo = db.db("accounts");
            var query = ({
                $or: [{ $and: [{ "firstname": chkFname }, { "lastname": chkLname }] },
                    { "userlogin": chkUser },
                    { "email": chkEmail },
                    { "IDcardpass": chkID }
                ]
            }); //

            let respdb;
            try {
                dbo.collection("users").find(query).toArray(function(err, result) {
                    if (result == '') {
                        console.log("Exisiting  : nothing ");
                        callback(null, {
                            answer: {
                                "userlogin": null,
                                "email": null,
                                "stat": "notthing",
                                "error": null
                            }
                        });
                        db.close();
                        return false; //  Must be here
                    }
                    if (err) {
                        callback("Error", {
                            answer: {
                                "userlogin": null,
                                "email": null,
                                "stat": "error",
                                "error": err
                            }
                        });
                        db.close();
                        return false; //  Must be here
                    }
                    if (!result == '') {
                        //console.log( "password test [0] " +result[0].password);
                        //console.log( "password ---> right : " +result ) ;
                        for (x in result) {
                            console.log("Existing user : " + result[0].userlogin);
                            callback(null, {
                                answer: {
                                    "userlogin": result[0].userlogin,
                                    "email": result[0].password,
                                    "stat": "exisiting",
                                    "error": null
                                }
                            });
                        } //  End if err
                        db.close();
                    } //
                }); // END dbo
            } /* end try */
            catch (e) {
                callback("Catch Error", {
                    answer: {
                        "userlogin": null,
                        "email": null,
                        "stat": "error",
                        "error": e
                    }
                });
                console.log("Error catch \n" + e);
                return false; //  Must be here

            } /* End catch */
        };

    }); //END MongoClient.connect
}; // END chkpass


obj.chkpass = function(chkUser, callback) {
    if (!chkUser) return;
    MongoClient.connect(url, function(err, db) {
        var x, txt = "";
        if (err) {
            console.log(" Cilent error ");
            callback(err, null);
        };
        if (db != null) {
            var dbo = db.db("accounts");
            var query = { userlogin: chkUser };
            let respdb;
            try {
                dbo.collection("users").find(query).toArray(function(err, result) {
                    if (result == '') {
                        callback(null, {
                            answer: {
                                "userlogin": null,
                                "password": null,
                                "stat": "found",
                                "error": null
                            }
                        });
                        db.close();
                        return false; //  Must be here
                    }
                    if (err) {
                        callback("Error", {
                            answer: {
                                "userlogin": null,
                                "password": null,
                                "stat": "error",
                                "error": err
                            }
                        });
                        db.close();
                        return false; //  Must be here
                    }
                    if (!result == '') {
                        //console.log( "password test [0] " +result[0].password);
                        //console.log( "password ---> right : " +result ) ;
                        callback(null, {
                            answer: {
                                "userlogin": result[0].userlogin,
                                "password": result[0].password,
                                "stat": "found",
                                "error": null
                            }
                        });
                    } //  End if err
                    db.close();

                }); // END dbo
            } /* end try */
            catch (e) {
                callback("Catch Error", {
                    answer: {
                        "userlogin": null,
                        "password": null,
                        "stat": "error",
                        "error": e
                    }
                });
                console.log("Error catch \n");
                return false; //  Must be here

            } /* End catch */
        };

    }); //END MongoClient.connect
}; // END chkpass


/*  === INTERNAL FUNCTION ======    */
/*
 *
 */

obj.updateuser = function(uUser) {
    return " Update user :" + uUser;
};
obj.deleteuser = function(uUser) {
    return " Delete user :" + uUser;
};
var hello = function(hUser) {
    return "Hello " + hUser;
}

exports.data = obj; // Method
exports.hello = hello; // Var
/*  ========== Below just function tester ===== */
/*
obj.coinsBalance ( 2  , function ( err , res  ) {
   console.log ( " Balance of : 1 ==  " + JSON.stringify(res,null,'\t') ) ;
}) ;  ////
*/

// obj.findDepAddr =  function ( OwnerID ,callback ){
/*
obj.findDepAddr ( 2  ,function (err , res ){
         // console.log (JSON.stringify(res,null,'\t') ) ;
        var x,y  = "" ;
        for ( x in res ) {
           if  ( res[x].token_doc  ) {
                   for ( y in  res[x].token_doc ) {
                 console.log ( " ==>   " + res[x].coin_doc[y].coinName + " ADDR  "  + res[x].coin_doc[y].coinAddr    )  ;
              }  // INNER FOR
            }
        }

}) ;
obj.findDepAddr ( 2  ,function (err , res ){
          console.log (JSON.stringify(res,null,'\t') ) ;
}) ;
*/
/*  END of ALL */