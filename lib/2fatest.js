const otp = require ('./oath') ; 

  var res = otp.twoFA.genkey () ; 

  console.log ( "KEY : " + res ) ;
