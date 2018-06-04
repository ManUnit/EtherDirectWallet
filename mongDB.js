var MongoClient = require('mongodb').MongoClient;
var config = require('./config.json');
var url = "mongodb://" + config.mongoDB.user + ":" + config.mongoDB.password + "@localhost:27017/";

var obj = {} ;
obj.finduser =  function ( quser ){
         var txt = "old value" ;
    findUser(quser).then(function (result) {
		return result.txt;
	}).catch(function (err) {
        return err.err;
	});

} // END finduser 
obj.updateuser = function ( uUser ) {
  return " Update user :" + uUser ;
};
obj.deleteuser = function ( uUser ) {
  return " Delete user :" + uUser ;
};  
function findUser(query){
    return new Promise(
        function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                var x = "" ;
                if (err){
                    reject({err:err});
				};
                var dbo = db.db("accounts");
                return txt ;
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
                    resolve({txt:txt});
                });

            }); //END MongoClient.connect
		}
	);
}
var hello = function( hUser ){
  return "Hello " + hUser  ;
}

exports.data=obj ; // Method
exports.hello=hello ; // Var 
//exports.finduser=finduser ; // Var 

