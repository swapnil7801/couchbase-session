let app = require('../app');
const requestPromise = require('request-promise');
const logger = require("../config/winston");

class GenericService {
	async getSession(sessionId = '0', uri, ttl) {
		let dbData = await app.dbAdapter.getSession(sessionId);
		//get from db
		if (dbData) {
			return dbData
		} else {
			let data = await requestPromise.get(uri);
			// let generatedId = 'sid' + Date.now();
			let generatedId = `sid +${Date.now()}`;
			let updatedData;
			try {
				updatedData = await app.dbAdapter.setSession(generatedId, JSON.parse(data), ttl);
			} catch (err) {
				logger.error(`getSession error,${err.status}`);
			}
			return updatedData;
		}
	}
}

module.exports = GenericService;