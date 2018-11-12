var express = require('express');
var router = express.Router();

// var user_service = require('../service/user_service');
var service_config = require('../config/service_config');
const service_basePath = process.cwd()+"/service/";
var generic_api=require('../service/generic_api');

// var serviceObj=service_config;
/*
	bootstrap and load all service exports in SERVICES variable
	Services['service_name'] = require function 
	abc.service = require(basePath+/config.service)
	Service['user']['session'] = {
		config: ,
		service: require()
	}
*/
traverse(service_config);


router.get('/:uri/:id?', function(req, res) {
	// console.log("req.pathname",req);
	var current_base_uri = 'users';
	var current_dynamic_uri = req.params.uri;
	const serv_config = service_config[current_base_uri][current_dynamic_uri];
	
	if (serv_config) {
		const service_key = serv_config['service'];
		const service_uri = serv_config['serviceUri'];
		if(service_key){
			var ttl = serv_config['ttl'];
			console.log("serviceName",ttl);
			serv_config['service'].getSessionData(req.params.id,ttl)
				.then((profileRes)=>{
					res.status('200').send(profileRes);
				});
		} else if (service_uri) {
			console.log("service URI found for current route");
			var ttl = serv_config['ttl'];
			// console.log("serviceName",ttl);
			generic_api.get(req.params.id,service_uri,ttl)
				.then((uriResponse)=>{
					res.status('200').send(uriResponse);
				});
		} 
	}else {
		console.log("service configuration not found.");
		res.status('200').send('service configuration not found.');
	}
});

function traverse(object) {
    for (var i in object) {
        if(i=='service'){
        console.log('key : ' + i + ', value: ' + object[i]);
        object['service']=require(service_basePath+object[i]);
        	}
        if (object[i] !== null && typeof(object[i])=="object") {
            //going on step down in the object tree!!
            traverse(object[i]);
        }
    }
  };

module.exports = router;