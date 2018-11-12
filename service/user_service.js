 var userService = {};
 var app = require('../app');
 var rp = require('request-promise');

 userService.getSessionData = async function(sessionId='0', ttl) {

 	var dbData = await app.dbAdapter.get(sessionId);
 	if (dbData) {
 		return dbData
 	} else {
 		var profileData = await getProfileFormServer();
 		var generatedId = 'sid' + Date.now()
 		var updatedData = await app.dbAdapter.set(generatedId, profileData, ttl);
 		return updatedData;
 	}
 }
 userService.setResource = function(sid, data, callback) {
 	app.dbAdapter.get('1234').then((sessionData) => {
 		callback("result");
 	});
 }

 function getProfileFormServer() {
 	var options = {
 		uri: 'http://localhost:3004/data',
 		headers: {
 			'User-Agent': 'Request-Promise'
 		},
 		json: true // Automatically parses the JSON string in the response
 	};

 	return new Promise((resolve, reject) => {
 		rp(options)
 			.then(function(profileData) {
 				console.log('User has %s repos', profileData);
 				resolve(profileData);
 			})
 			.catch(function(err) {
 				reject(err);
 			});
 	})
 }
 module.exports = userService;