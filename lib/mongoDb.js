/*
 * This file Create by Anan P.
 * create date 1 June 2018
 *
 *
 * 
 * 
*/
 // web3.eth.getBalance(contract.address)
var autoIncrement = require("mongodb-autoincrement");
var MongoClient = require('mongodb').MongoClient,format = require('util').format;
var config = require('../etc/config.json');
// var web3 = require('./token1.js');
var coinFunc  = require('./coinfunction'); 
// coinFunc.coinbase.getCoinBalance ( reqAddr, res );
// coinFunc.coinbase.getTokenBalance (reqAddr,contract,res)

const util = require('util') ; // tool for view [object to JSON ]
var path = require('path');
//  Conniting ETH
var CONWeb3 = require('web3');
var web3 =  new CONWeb3("http://" + config.RPCSVR + ":" + config.RPCPORT ) ;
// test web3 console.log (web3.utils.fromWei( "3423837732949323425392388453453222",'ether') ) ;
var url = "mongodb://" + config.mongoDB.user + ":" + config.mongoDB.password + "@localhost:27017/";
var obj = {} ; // Main defind

obj.findDepAddr =  function ( OwnerID ,callback ){
    var data = "" ;
    MongoClient.connect(url, function(err, db) {
        var x , coldata =  "" ;
        if (err){
            callback(err,null);
	    return false ;
        };
        var dbo = db.db("asset");
        var query = ([  
         { 
            '$lookup' : {
                "from" : "coins", 
                "localField" : "ownerid", 
                "foreignField" : "ownerid", 
                "as" : "coin_doc"
            }
        },
        { 
            "$lookup" : {
                "from" : "tokens", 
                "localField" : "ownerid", 
                "foreignField" : "ownerid", 
                "as" : "token_doc"
            }
        },
	{ 
            "$match" : {
            "ownerid" : OwnerID
                }
        }
	]);
	 //console.log ( "      " + JSON.stringify( query  )   ) ;
	var PromiseResolve = [] ;
        dbo.collection("owners").aggregate(query).toArray(function(err, res ) {
           if (err){ db.close() ; return  err } ;
            db.close();
	 var x,y  = "" ;
		 for ( x in res ) {
		//	 console.log ( " x = " + x ) ;
		     if ( res[x].coin_doc  ) {
		              for ( y in  res[x].coin_doc ) {
			       //  console.log ( " coin y = " + y ) ;
				PromiseResolve.push ({
			   	  "depName" : res[x].coin_doc[y].coinName ,
			   	  "depAddr" : res[x].coin_doc[y].coinAddr 
				}) ;       
			        // console.log ( " ==>   " + res[x].coin_doc[y].coinName + " Coin ADDR  "  + res[x].coin_doc[y].coinAddr    )  ;
			      }  // INNER FOR
		      }  // 1ft IF
		      if ( res[x].token_doc  ) {
		              for ( y in  res[x].token_doc ) {
			       //  console.log ( " token y = " + y ) ;
				PromiseResolve.push ({
			   	  "depName" : res[x].token_doc[y].tokenName ,
			   	  "depAddr" : res[x].token_doc[y].tokenAddr 
				}) ;       
			      //   console.log ( " ==>   " + res[x].token_doc[y].tokenName + " Token ADDR  "  + res[x].token_doc[y].tokenAddr    )  ;
			      }  // INNER FOR
		     }  // End 2nd if
		 } // End 1ft for 	 
            callback(null,PromiseResolve); // Return
         return true ;
        });  // END dbo
    }); //END MongoClient.connect
} // END finduser 


obj.coinsBalance = function(userid,callback){
   MongoClient.connect(url, function (err, db) {
        var dbo = db.db("asset");
	var query = {  
                "ownerid" : userid 	
	} ;
//	var balance = await  web3.eth.getBalance( "0x82378cf137F5dF4FA730529eB79a4583EA605FA9" ) ;
//	console.log ("Balance :" + JSON.stringify( balance )   ) ;
//      console.log (web3.utils.fromWei( "3423837732949323425392388453453222",'ether') ) ;
	dbo.collection("coins").find(query).toArray(function(err, result ) {
	        var i = "" ; 
		var coinAddr , ownerid = "" ; 
		var promiseResolve = [] ; 
//		console.log ( " result " + JSON.stringify ( result ) ) ;
//		if ( result.length == 0  ) console.log ( " result == Nothing  " + JSON.stringify ( result ) ) ;
		if ( err ){  return  err }  ; 
                if (result.length > 0  ) {  ;  
		     if(result[0].coinAddr )  coinAddr  =  result[0].coinAddr   ;	
		     if(result[0].ownerid )  ownerid = result[0].ownerid  ;	
		     if(result[0].coinName)   coinName = result[0].coinName  ;	
	                coinFunc.coinbase.getCoinBalance( coinAddr  , function ( err ,  res)   {
					if (err == null ) {
				         promiseResolve.push({ 
						 "ownerid" : ownerid , 
						 "coinAddr" : coinAddr , 
						 "coinName" :  coinName , 
						 "coinBalance" : res  
					 }) ;
					}else {
					       console.log ( "Error : " + err ) ;
					}   // 
			        callback ( null ,  promiseResolve  ) ;
			}) ; // End coin Func
	       return true  ;
	 }
		if ( result.length == 0  )  {
		  
		  callback ( "Error" , []  ) ;
	 	  return false  ; 
	    } ;  
	} ) ; //
    }) ; //
} /* End coinsBalance  */ 	

obj.tokensBalance = function(userid,callback){
   MongoClient.connect(url, function (err, db) {
        var dbo = db.db("asset");
	var query = {  
                "ownerid" : userid 	
	} ;
	dbo.collection("tokens").find(query).toArray(function(err, result ) {
		if (err) return err ; 
                 if ( result.length == 0 ) return [] ;
		var promiseResolve = [] ; 
		        tokenAddr = result[0].tokenAddr  ;	
		        ownerid = result[0].ownerid  ;	
		        tokenName = result[0].tokenName  ;	
	                coinFunc.coinbase.getCoinBalance( tokenAddr  , function ( err ,  res)   {
					if (err == null ) {
				         promiseResolve.push({ 
						 "ownerid" : ownerid , 
						 "tokenAddr" : tokenAddr , 
						 "tokenName" :  tokenName , 
						 "tokenBalance" : res  
					 }) ;
					}else {
					       console.log ( "Error : " + err ) ;
					}/* End if err */
			        callback ( null ,  promiseResolve  ) ;
			}) ; // End coin Func
           // callback ( null , result  ) ;
	   return ;
	} ) ; //
    }) ; //
} // End  	

obj.insertReg = function ( uname,fname,lname,email,birth,pass,callback  ){ 

   MongoClient.connect(url, function (err, db) {
            var dbo = db.db("accounts");
	    var doccollet = "registor" ;
	    autoIncrement.getNextSequence(dbo, doccollet , function (err, autoIndex) {
		            var collection = dbo.collection(doccollet);
		            collection.insert({
				                "userid": autoIndex,
						 "userlogin" : uname ,
						 "firstname" : fname ,
						 "lastname" : lname ,
						 "email" : email ,
						 "birth" : birth ,
						 "password" : pass 
				            });
		        if (err == null ) callback ( null , "OK" ) ; 
		        return ;
		        });

   });
} // End insert 

obj.insertLoginUser =  function ( uname,fname,lname,email,birth,pass,callback ){
    var txt = "" ;
    MongoClient.connect(url, function(err, db) {
        var x = "" ;
        if (err){
            callback(err,null);
        };
        var dbo = db.db("accounts");
        var inputData = { 
		 "userid" :  "  "  ,
		 "userlogin" : uname ,
		 "firstname" : fname ,
		 "lastname" : lname ,
		 "email" : email ,
		 "birth" : birth ,
		 "password" : pass 
		 
	};
        let respdb ;
        dbo.collection("registor").insert( inputData , function (err, result ) {
            if (err) return err;
            db.close();
            txt = "OK"  ;
            callback(null,"OK"); // Return
	    return txt ; 
        });  // END dbo
    }); //END MongoClient.connect
  //  }) //
} // END insert user

obj.insertSession =  function ( userId , sess ,  uxtime ,ipaddr ,callback ){
    var txt = "" ;
    MongoClient.connect(url, function(err, db) {
        var x = "" ;
        if (err){
            callback(err,null);
        };
        var dbo = db.db("webserv");
        var inputData = { 
		 "accountId" : userId  ,
		 "sessionId" : sess ,  
		 "unixtime" :  uxtime , 
		 "ipaddr" :  ipaddr  
		 
	};
        let respdb ;
        dbo.collection("sessions").insert( inputData , function (err, result ) {
            if (err) return err;
            db.close();
            txt = "OK"  ;
            callback(null,"OK"); // Return
	    return txt ; 
        });  // END dbo
    }); //END MongoClient.connect
} // END insert Session

obj.findSession =  function ( accID ,callback ){
    var data = "" ;
    MongoClient.connect(url, function(err, db) {
        var x , coldata =  "" ;
        if (err){
            callback(err,null);
        };
        var dbo = db.db("webserv");
        var query = { accountId : accID  };
        let respdb ;
        dbo.collection("sessions").find(query).toArray(function(err, result ) {
            if (err) return err;
            db.close();
            callback(null,result); // Return
        });  // END dbo
    }); //END MongoClient.connect
} // END finduser 

obj.finduser =  function ( quser,callback ){
    var txt = "" ;
    MongoClient.connect(url, function(err, db) {
        var x = "" ;
        if (err){
            callback(err,null);
        };
        var dbo = db.db("accounts");
        var query = { userlogin : quser  };
        let respdb ;
        dbo.collection("users").find(query).toArray(function(err, result ) {
            if (err) return err;
            txt += "<table border=#1 >" ;
                txt += "<tr><td>IDCard Number" +
                    "</td><td>Userlogin" + 
                    "</td><td>FirstName" + 
                    "</td><td>Lastname" + 
                    "</td><td> Email </td></tr>\n";
            for (x in result ) {
                txt += "<tr><td>" + result[x].IDcardpass +
                    "</td><td>" + result[x].userlogin +
                    "</td><td>" + result[x].firstname +
                    "</td><td>" + result[x].lastname +
                    "</td><td>" + result[x].email + "</td></tr>\n";
            }
            txt += "</table>" ;
            db.close();
            callback(null,txt); // Return
        });  // END dbo
    }); //END MongoClient.connect
} // END finduser 

obj.regExisting =  function ( chkUser,chkEmail,callback )  {
    MongoClient.connect(url, function(err, db) {
        var x,txt = "" ;
        if (err){
            console.log ( " Cilent error " ) ;
            callback(err,null);
        };
	    if ( db != null ){
		var dbo = db.db("accounts");
		var query = (
			{$or: [
				{"userlogin" : chkUser },
				{"email" : chkEmail }
			]}
		);  // 
	        
		let respdb ;
		try {
	  dbo.collection("registor").find(query).toArray(function(err, result ) {
		    if ( result=='' ){
            // console.log ( "Exisiting  : nothing  OK FOR registor new user"  ) ;
		       callback(null,{ answer : { 
						"userlogin" : null   ,
						"email" : null  ,
						"stat" : "notthing"   ,
						"error" :  null  
					     } //
				 } //
			    ); 
		       db.close() ;
		       return false ;   //  Must be here
		    }
		    if (err) {
		    callback( "Error" ,{ answer : { 
						"userlogin" : null   ,
						"email" : null   ,
						"stat" : "error"  ,
						"error" : err  
					     }  //
				       } //
			    ); 
		    db.close() ;
		    return false ;   //  Must be here
		    }
		    if ( !result==''   ) {
		    //console.log( "password test [0] " +result[0].password); 
		    //console.log( "password ---> right : " +result ) ; 
	             for ( x in result ) {
			    console.log ( "Existing user : " + result[0].userlogin ) ;
		    callback(null,{ answer : { 
					        "userlogin" : result[0].userlogin  ,
					        "email" : result[0].email  ,
						"stat" : "exisiting"   ,
						"error" :  null  
					     } //
				 } //
			    ); 
		    } //  End if err
		    db.close();
		   } //   
		});  // END dbo
		}  /* end try */ 
		  catch(e){
		    callback( "Catch Error" ,{ answer : { 
						"userlogin" : null   ,
						"email" : null   ,
						"stat" : "error"  ,
						"error" : e  
					     } // 
				       }  //
			    ); 
		   console.log ( "Error catch \n" + e ) ;
		   return false ;   //  Must be here

		} /* End catch */ 
        } ; 

    }); //END MongoClient.connect
}; // END chkpass

obj.userExisting =  function ( chkID,chkUser,chkEmail,chkFname,chkLname,callback )  {
    MongoClient.connect(url, function(err, db) {
        var x,txt = "" ;
        if (err){
            console.log ( " Cilent error " ) ;
            callback(err,null);
        };
	    if ( db != null ){
		var dbo = db.db("accounts");
		var query = (
			{$or: [{$and: [{ "firstname" : chkFname },{ "lastname" : chkLname }]},
				{"userlogin" : chkUser },
				{"email" : chkEmail },
				{ "IDcardpass" : chkID }
			]}
		);  // 
	        
		let respdb ;
		try {
		dbo.collection("users").find(query).toArray(function(err, result ) {
		    if ( result=='' ){
             console.log ( "Exisiting  : nothing "  ) ;
		       callback(null,{ answer : { 
						"userlogin" : null   ,
						"email" : null  ,
						"stat" : "notthing"   ,
						"error" :  null  
					     }
				 }
			    ); 
		       db.close() ;
		       return false ;   //  Must be here
		    }
		    if (err) {
		    callback( "Error" ,{ answer : { 
						"userlogin" : null   ,
						"email" : null   ,
						"stat" : "error"  ,
						"error" : err  
					     } 
				       } 
			    ); 
		    db.close() ;
		    return false ;   //  Must be here
		    }
		    if ( !result==''   ) {
		    //console.log( "password test [0] " +result[0].password); 
		    //console.log( "password ---> right : " +result ) ; 
	             for ( x in result ) {
			    console.log ( "Existing user : " + result[0].userlogin ) ;
		    callback(null,{ answer : { 
					        "userlogin" : result[0].userlogin  ,
					        "email" : result[0].password  ,
						"stat" : "exisiting"   ,
						"error" :  null  
					     }
				 }
			    ); 
		    } //  End if err
		    db.close();
		   } //   
		});  // END dbo
		}  /* end try */ 
		  catch(e){
		    callback( "Catch Error" ,{ answer : { 
						"userlogin" : null   ,
						"email" : null   ,
						"stat" : "error"  ,
						"error" : e  
					     } 
				       } 
			    ); 
		   console.log ( "Error catch \n" + e ) ;
		   return false ;   //  Must be here

		} /* End catch */ 
        } ; 

    }); //END MongoClient.connect
}; // END chkpass


obj.Regchkpass =  function ( chkUser,callback )  {
    MongoClient.connect(url, function(err, db) {
        var x,txt = "" ;
        if (err){
            console.log ( " Cilent error " ) ;
            callback(err,null);
        };
	    if ( db != null ){
		var dbo = db.db("accounts");
		var query = { userlogin : chkUser  };
		let respdb ;
		try {
		dbo.collection("registor").find(query).toArray(function(err, result ) {
		    if ( result=='' ){
		       callback(null,{ answer : { 
						"objid" : null   ,
						"userid" : null   ,
						"userlogin" : null   ,
						"password" : null  ,
						"stat" : "found"   ,
						"error" :  null  
					     }
				 }
			    ); 
		       db.close() ;
		       return false ;   //  Must be here
		    }
		    if (err) {
		    callback( "Error" ,{ answer : { 
						"objid" : null   ,
						"userid" : null   ,
						"userlogin" : null   ,
						"password" : null   ,
						"stat" : "error"  ,
						"error" : err  
					     } 
				       } 
			    ); 
		    db.close() ;
		    return false ;   //  Must be here
		    }
		    if ( !result==''   ) {
		    //console.log( "password test [0] " +result[0].password); 
		    //console.log( "password ---> right : " +result ) ; 
		    callback(null,{ answer : { 
						"objid" : result[0]._id   ,
						"userid" : result[0].userid   ,
					        "userlogin" : result[0].userlogin  ,
					        "password" : result[0].password  ,
						"stat" : "found"   ,
						"error" :  null  
					     }
				 }
			    ); 
		    } //  End if err
		    db.close();
		    
		});  // END dbo
		}  /* end try */ 
		  catch(e){
		    callback( "Catch Error" ,{ answer : { 
						"objid" : null   ,
						"userid" : null   ,
						"userlogin" : null   ,
						"password" : null   ,
						"stat" : "error"  ,
						"error" : e  
					     } 
				       } 
			    ); 
		   console.log ( "Error catch \n" ) ;
		   return false ;   //  Must be here

		} /* End catch */ 
        } ; 

    }); //END MongoClient.connect
}; // END chkpass

obj.updateuser = function ( uUser ) {
  return " Update user :" + uUser ;
};
obj.deleteuser = function ( uUser ) {
  return " Delete user :" + uUser ;
};
var hello = function( hUser ){
  return "Hello " + hUser  ;
}

exports.data=obj ; // Method
exports.hello=hello ; // Var 
//exports.finduser=finduser ; // Var 


obj.userExisting =  function ( chkID,chkUser,chkEmail,chkFname,chkLname,callback )  {
    MongoClient.connect(url, function(err, db) {
        var x,txt = "" ;
        if (err){
            console.log ( " Cilent error " ) ;
            callback(err,null);
        };
	    if ( db != null ){
		var dbo = db.db("accounts");
		var query = (
			{$or: [{$and: [{ "firstname" : chkFname },{ "lastname" : chkLname }]},
				{"userlogin" : chkUser },
				{"email" : chkEmail },
				{ "IDcardpass" : chkID }
			]}
		);  // 
	        
		let respdb ;
		try {
		dbo.collection("users").find(query).toArray(function(err, result ) {
		    if ( result=='' ){
             console.log ( "Exisiting  : nothing "  ) ;
		       callback(null,{ answer : { 
						"userlogin" : null   ,
						"email" : null  ,
						"stat" : "notthing"   ,
						"error" :  null  
					     }
				 }
			    ); 
		       db.close() ;
		       return false ;   //  Must be here
		    }
		    if (err) {
		    callback( "Error" ,{ answer : { 
						"userlogin" : null   ,
						"email" : null   ,
						"stat" : "error"  ,
						"error" : err  
					     } 
				       } 
			    ); 
		    db.close() ;
		    return false ;   //  Must be here
		    }
		    if ( !result==''   ) {
		    //console.log( "password test [0] " +result[0].password); 
		    //console.log( "password ---> right : " +result ) ; 
	             for ( x in result ) {
			    console.log ( "Existing user : " + result[0].userlogin ) ;
		    callback(null,{ answer : { 
					        "userlogin" : result[0].userlogin  ,
					        "email" : result[0].password  ,
						"stat" : "exisiting"   ,
						"error" :  null  
					     }
				 }
			    ); 
		    } //  End if err
		    db.close();
		   } //   
		});  // END dbo
		}  /* end try */ 
		  catch(e){
		    callback( "Catch Error" ,{ answer : { 
						"userlogin" : null   ,
						"email" : null   ,
						"stat" : "error"  ,
						"error" : e  
					     } 
				       } 
			    ); 
		   console.log ( "Error catch \n" + e ) ;
		   return false ;   //  Must be here

		} /* End catch */ 
        } ; 

    }); //END MongoClient.connect
}; // END chkpass


obj.chkpass =  function ( chkUser,callback )  {
    MongoClient.connect(url, function(err, db) {
        var x,txt = "" ;
        if (err){
            console.log ( " Cilent error " ) ;
            callback(err,null);
        };
	    if ( db != null ){
		var dbo = db.db("accounts");
		var query = { userlogin : chkUser  };
		let respdb ;
		try {
		dbo.collection("users").find(query).toArray(function(err, result ) {
		    if ( result=='' ){
		       callback(null,{ answer : { 
						"userlogin" : null   ,
						"password" : null  ,
						"stat" : "found"   ,
						"error" :  null  
					     }
				 }
			    ); 
		       db.close() ;
		       return false ;   //  Must be here
		    }
		    if (err) {
		    callback( "Error" ,{ answer : { 
						"userlogin" : null   ,
						"password" : null   ,
						"stat" : "error"  ,
						"error" : err  
					     } 
				       } 
			    ); 
		    db.close() ;
		    return false ;   //  Must be here
		    }
		    if ( !result==''   ) {
		    //console.log( "password test [0] " +result[0].password); 
		    //console.log( "password ---> right : " +result ) ; 
		    callback(null,{ answer : { 
					        "userlogin" : result[0].userlogin  ,
					        "password" : result[0].password  ,
						"stat" : "found"   ,
						"error" :  null  
					     }
				 }
			    ); 
		    } //  End if err
		    db.close();
		    
		});  // END dbo
		}  /* end try */ 
		  catch(e){
		    callback( "Catch Error" ,{ answer : { 
						"userlogin" : null   ,
						"password" : null   ,
						"stat" : "error"  ,
						"error" : e  
					     } 
				       } 
			    ); 
		   console.log ( "Error catch \n" ) ;
		   return false ;   //  Must be here

		} /* End catch */ 
        } ; 

    }); //END MongoClient.connect
}; // END chkpass


/*  === INTERNAL FUNCTION ======    */
/*
 *
*/

obj.updateuser = function ( uUser ) {
  return " Update user :" + uUser ;
};
obj.deleteuser = function ( uUser ) {
  return " Delete user :" + uUser ;
};
var hello = function( hUser ){
  return "Hello " + hUser  ;
}

exports.data=obj ; // Method
exports.hello=hello ; // Var 
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