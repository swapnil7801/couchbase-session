'use strict';

const couchbase = require("couchbase");
const logger = require("../config/winston");

class CouchbaseStore {

    constructor(options) {
        this.options = options;
        this.pool = null;
    }
    getPool() {
        const connectionUrl = `couchbase://${this.options.host}`;
        const cluster = new couchbase.Cluster();
        cluster.authenticate(this.options.username, this.options.password);
        // Will be creating the Bucket Instances once here
        this.pool = cluster.openBucket(this.options.bucket);
        return this.pool;
    }
    async getSession(sid) {
        try {
            return await this.getQueryPromise(sid);
        } catch (err) {
            logger.error(`getSession error,${err.status}`);
        }
    };
    async setSession(sid, session, ttl) {
        let data = session;
        try {
            return await this.setQueryPromise(sid, data, parseInt(ttl));
        } catch (err) {
            logger.error(`setSession error,${err.status}`);
        }
    };
    async destroySession(sid) {
        console.log(" CouchbaseStore.prototype.destroy sid ", sid)
        let result;
        try {
            result = await this.deleteQueryPromise(sid);
        } catch (err) {
            logger.error(`destroySession error,${err.status}`);
        }
    };
    async getQueryPromise(sid) {
        let connection = this.getPool();
        return new Promise((resolve, reject) => {
            connection.get(sid, (err, result) => {
                if (result) {
                    resolve(result.value);
                } else if (err.code === 13) {
                    resolve(null);
                } else {
                    reject(err);
                }
            });
        })
    }
    async setQueryPromise(sid, data, ttl = 5000) {
        let connection = this.getPool();
        let options = {};
        options.expiry = ttl;
        return new Promise((resolve, reject) => {
            // console.log("setting datain couchbase store options",options,data);
            connection.upsert(sid, data, options, (err, result) => {
                if (result) {
                    let res = {
                        data: data,
                        sid: sid
                    }
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        })
    }
    async deleteQueryPromise(sid) {
        let connection = this.getPool();
        return new Promise((resolve, reject) => {
            connection.remove(sid, (err, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        })
    }
};
module.exports = CouchbaseStore;