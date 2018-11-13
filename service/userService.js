 let app = require('../app');
 let requestPromise = require('request-promise');
 const logger = require("../config/winston");

 class UserService {

 	async getSessionData(sessionId = '0', ttl) {
 		let dbData;
 		try {
 			dbData = await app.dbAdapter.getSession(sessionId);
 		} catch (err) {
 			logger.error(`getSession error,${err.status}`);
 		}
 		if (dbData) {
 			return dbData
 		} else {
 			let profileData = await this.getProfileFormServer();
 			// let generatedId = 'sid' + Date.now()
 			let generatedId = `sid +${Date.now()}`;
 			let updatedData;
 			try {
 				updatedData = await app.dbAdapter.setSession(generatedId, profileData, ttl);
 			} catch (err) {
 				logger.error(`getSession error,${err.status}`);
 			}
 			return updatedData;
 		}
 	}
 	getProfileFormServer() {
 		let options = {
 			uri: 'http://localhost:3004/data',
 			headers: {
 				'User-Agent': 'Request-Promise'
 			},
 			json: true // Automatically parses the JSON string in the response
 		};
 		return requestPromise(options)
 	}
 }

 module.exports = UserService;