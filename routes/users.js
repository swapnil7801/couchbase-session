let express = require("express");
let router = express.Router();

// var user_service = require('../service/user_service');
const service_config = require("../config/service_config");
const service_basePath = process.cwd()+"/service/";
const generic_api=require("../service/generic_api");
traverse(service_config);


router.get("/:uri/:id?", function(req, res) {
    let current_base_uri = "users";
    let current_dynamic_uri = req.params.uri;
    const serv_config = service_config[current_base_uri][current_dynamic_uri];
	
    if (serv_config) {
        const service_key = serv_config["service"];
        const service_uri = serv_config["serviceUri"];
        if(service_key){
            let ttl = serv_config["ttl"];
            let service_obj=new serv_config["service"];
            service_obj.getSessionData(req.params.id,ttl)
                .then((profileRes)=>{
                    res.status("200").send(profileRes);
                });
        } else if (service_uri) {
            console.log("service URI found for current route");
            let ttl = serv_config["ttl"];
            let generic_api_object=new generic_api();
            generic_api_object.get(req.params.id,service_uri,ttl)
                .then((uriResponse)=>{
                    res.status("200").send(uriResponse);
                });
        } 
    }else {
        res.status("200").send("service configuration not found.");
    }
});

function traverse(object) {
    for (var i in object) {
        if(i=="service"){
            // console.log("key : " + i + ", value: " + object[i]);
            object["service"]=require(service_basePath+object[i]);
        	}
        if (object[i] !== null && typeof(object[i])=="object") {
            //going on step down in the object tree!!
            traverse(object[i]);
        }
    }
}

module.exports = router;