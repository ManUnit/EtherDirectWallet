var coinFunc = require("./ctest") ;
//coinFunc.coinbase.tokenApproval (reqSendAdress,reqApproveSend , reqTokenContract ,sendCrypt, approveAmonut  , function ( )[

coinFunc.coinbase.App ( 
         	 "0xd1dc78f2865a7288a4a4b84272aaa5316cf37bab" ,
	         "0x82378cf137F5dF4FA730529eB79a4583EA605FA9" , 
	         "0xa70a8d416c22e5817323f2cebf233d929e5722a1" ,
	         "87b9fd1caa5e822063c4cd7e812edc0cd445f9647b819b2ee0cdda8277a2d8ee"  ,
	         "1000" ,
	        function ( err , res ){
		if (err) console.log("\n\n ================ERROR================\n\n" + err) ; 
}) ;
