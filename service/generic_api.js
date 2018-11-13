 let app = require('../app');
 const rp = require('request-promise');

 class GenericService {

 	async get(sessionId = '0', uri, ttl) {

 		let dbData = await app.dbAdapter.get(sessionId);
 		//get from db
 		if (dbData) {
 			return dbData
 		} else {
 			let data = await rp.get(uri);
 			let generatedId = 'sid' + Date.now()
 			let updatedData = await app.dbAdapter.set(generatedId, JSON.parse(data), ttl);
 			return updatedData;
 		}
 	}
 }

 module.exports = GenericService;