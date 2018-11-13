 let app = require('../app');
 let rp = require('request-promise');


class UserService{

 async getSessionData(sessionId='0', ttl) {

 	let dbData = await app.dbAdapter.get(sessionId);
 	if (dbData) {
 		return dbData
 	} else {
 		let profileData = await this.getProfileFormServer();
 		let generatedId = 'sid' + Date.now()
 		let updatedData = await app.dbAdapter.set(generatedId, profileData, ttl);
 		return updatedData;
 	}
 }
  setResource(sid, data, callback) {
 	app.dbAdapter.get('1234').then((sessionData) => {
 		callback("result");
 	});
 }

  getProfileFormServer() {
 	let options = {
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
}

 
 module.exports = UserService;