var aslogin = {
    "ERROR": "Re Login again <a href='/account'   > Login </a> ",
    "opsition": "logout",
    "item": -1,
    "res_div": '<div class="col" > </div>',
    "coin_address": "0x0",
    "transac_asset_res": "",

};
var asAddrerr = {
    "ERROR": " Receiver addres un support IBAN format please check again ",
    "opsition": "asviews",
    "item": -1,
    "res_div": '<div class="col" > </div>',
    "coin_address": "0x0",
    "send_div": "",
    "transac_asset_res": "",
};
var cnlogin = {
    "ERROR": "Re Login again <a href='/account'   > Login </a> ",
    "position": "coinview",
    "item": -1,
    "res_div": '<div class="col" > </div>',
    "coin_address": '0x0',
    "co_addr_res": ' login please  '
};
var assendvalerr = {
    "ERROR": '<div class="col" > sent  not complate  !!  </div>',
    "opsition": "assetsend",
    "item": -1,
    "send_div": '<div class="col" > ERROR request at least 20 tokens </div>',
    "transac_asset_res": "",
};
var sendsuccess = {
    "ERROR": '<div class="col" >  </div>',
    "opsition": "assetsend",
    "item": -1,
    "send_div": '<div class="col" >  </div>' ,
    "transac_asset_res" : "" ,
};
var senderr = {
    "ERROR": '<div class="col" >  </div>',
    "opsition": "assetsend",
    "item": -1,
    "send_div": '<div class="col" >  </div>',
    "transac_asset_res": " Transection send  error ",
};
var TsacHeadHover = `    
            <div class="table-responsive">   
                <table class="table table-striped table-hover"> 
                  <thead> 
                    <tr> 
                      <th>Date</th> 
                      <th>Name</th> 
                      <th>Destination Address</th> 
                      <th>value</th> 
                      <th>Tx Hash</th> 
                    </tr>  
                  </thead> 
                  <tbody> 
       `; // End 
var TsacEndHover = `
                       </tbody>
                </table>
            </div>
                `; // En
var wrong_resp = {
    "transac_asset_res": '<h4 style="color:red;" >Wrong password</h4>',
    "ERROR": '<div class="col" >  </div>',
    "opsition": "assetsend",
    "item": -1,
    "send_div": '<div class="col" >  </div>',
};
var err_resp = {
    "ERROR": '<div class="col" >  </div>',
    "opsition": "assetsend",
    "item": -1,
    "send_div": '<div class="col" >  </div>',
};

var profile = {
    "display": {
        "ERROR": '<div class="col" >  </div>',
        "opsition": "profile-2fa",
        "item": -1,
        
    },
    "enableerror": {
        "ERROR": '<div class="col" > 2FA enable fialed </div>',
        "opsition": "profile-2fa",
        "item": -1,

    },
    "hidden2fa": {
        "ERROR": '<div class="col" >  </div>',
        "opsition": "profile-2fa",
        "item": -1,
        "profile_info_res": "",
        "twofa_number_res": "",
        "QRshow": ""
    },
    "relogin": {
        "ERROR": '<div class="col" >  </div>',
        "opsition": "profile-2fa",
        "item": -1,
        "profile_info_res": 'Please login again <a href="/account"> Click me please </a>',
        "twofa_number_res": "",
        "QRshow": ""
    },
    "EnableOK": {
        "ERROR": '<div class="col" ></div>',
        "opsition": "profile-2fa",
        "item": -1,
        "profile_info_res":"2FA Enabled done !!! ",
        "twofa_number_res": " ",
        "QRshow": " "
    },
        "enableDBerr": {
        "ERROR": '<div class="col" >enable 2FA database error</div>',
        "opsition": "profile-2fa",
        "item": -1,
        "profile_info_res":"",
        "twofa_number_res": "",
        "QRshow": ""
    }



};



exports.TsacHeadHover = TsacHeadHover;
exports.TsacEndHover = TsacEndHover;
exports.aslogin = aslogin;
exports.asAddrerr = asAddrerr;
exports.cnlogin = cnlogin;
exports.assendvalerr = assendvalerr;
exports.wrong_resp = wrong_resp;
exports.err_resp = err_resp;
exports.profile = profile;
