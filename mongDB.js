var MongoClient = require('mongodb').MongoClient;
var config = require('./config.json');
var url = "mongodb://" + config.mongoDB.user + ":" + config.mongoDB.password + "@localhost:27017/";

var obj = {} ;
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
            if (err) throw err;
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
		    console.log( "password error " + err ) ; 
		    callback( "Error" ,{ answer : { 
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

