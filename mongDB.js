var MongoClient = require('mongodb').MongoClient;
var config = require('./config.json');
var url = "mongodb://" + config.mongoDB.user + ":" + config.mongoDB.password + "@localhost:27017/";

var obj = {} ;
obj.finduser =  function ( quser,callback ){
    var txt = "old value" ;
    MongoClient.connect(url, function(err, db) {
        var x = "" ;
        if (err){
            callback(err,null);
        };
        var dbo = db.db("accounts");
        var query = { userlogin : quser  };
        let respdb ;
        dbo.collection("users").find(query).toArray(function(err, result ) {
            //if (err) throw err;
            txt = "<table>" ;
            for (x in result ) {
                txt += "<tr><td>" + result[x].IDcardpass +
                    "</td><td>" + result[x].userlogin +
                    "</td><td>" + result[x].firstname +
                    "</td><td>" + result[x].lastname +
                    "</td><td>" + result[x].email + "</td></tr>\n";
            }
            txt += "</table>" ;
            db.close();
            console.log( "new value txt>>>" + txt ) ;
            callback(null,txt); // Return
        });

    }); //END MongoClient.connect

} // END finduser 
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

