let app = require('../app');
const requestPromise = require('request-promise');
const logger = require("../config/winston");

class GenericService {
	async getSession(sessionId = '0', uri, ttl) {
		let sessionData = await app.dbAdapter.getSession(sessionId);
		//get from db
		let data;
		if (sessionData) {
			return sessionData;
		} else {
			try{
			 data = await requestPromise.get(uri);
		}catch(err){
			logger.error(`uri error,${err}`);
		}
			let generatedId = `sid +${Date.now()}`;
			let updatedData;
			try {
				updatedData = await app.dbAdapter.setSession(generatedId, JSON.parse(data), ttl);
			} catch (err) {
				logger.error(`getSession error,${err}`);
			}
			return updatedData;
		}
	}
}

module.exports = GenericService;