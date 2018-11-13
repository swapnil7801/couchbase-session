 var app = require('../app');
 var rp = require('request-promise');

 class GenericService {

 	async get(sessionId = '0', uri, ttl) {

 		var dbData = await app.dbAdapter.get(sessionId);
 		//get from db
 		if (dbData) {
 			return dbData
 		} else {
 			var data = await rp.get(uri);
 			var generatedId = 'sid' + Date.now()
 			var updatedData = await app.dbAdapter.set(generatedId, JSON.parse(data), ttl);
 			return updatedData;
 		}
 	}
 }

 module.exports = GenericService;