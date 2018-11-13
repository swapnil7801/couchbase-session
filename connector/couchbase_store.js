'use strict';

const couchbase = require('couchbase');

class CouchbaseStore {

    constructor(options){
        this.options=options;
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
    async get(sid) {
        console.log(" CouchbaseStore.prototype.get sid ", sid)
        let result = await this.getQueryPromise(sid);
        let session = null;
        if (result) {
            session = result;
        }
        return session
    };
      async set(sid, session, ttl) {
        let data = session;
        console.log(" CouchbaseStore.prototype.set ttl ", ttl)
        let result = this.setQueryPromise(sid, data, parseInt(ttl));
        await result.then(res => {})
            .catch(err => {
                console.log(err);
            })
        return result
    };
     async destroy(sid) {
        console.log(" CouchbaseStore.prototype.destroy sid ", sid)
        let result = await this.deleteQueryPromise(sid);
        // let session = null;
        // if (result) {
        //     session =result;
        // }
        // return session 
    };

     async getQueryPromise(sid) {
        let connection = this.getPool();
        return new Promise((resolve, reject) => {
            connection.get(sid, function(err, result) {
                if (result) {
                    // console.log("returning result",result);
                    resolve(result.value);
                } else if (err.code == 13) {
                    // console.log("err",err);
                    resolve(null);
                } else {
                    reject(err);
                }
            });


        })
    }

     async setQueryPromise(sid, data, ttl = 5000) {
        let connection = this.getPool();
        console.log("CouchbaseStore.prototype.setQueryPromise ttl", ttl);
        let options = {};
        options.expiry = ttl;
        return new Promise((resolve, reject) => {
            // console.log("setting datain couchbase store options",options,data);
            connection.upsert(sid, data, options, function(err, result) {
                if (result) {
                    // data.sid = sid;
                    var res = {
                        data: data,
                        sid: sid
                    }
                    console.log("result for upsert", res);
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
            connection.remove(sid, function(err, result) {
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