'use strict';

var couchbase = require('couchbase');

var CouchbaseStore = function(options) {
    let pool = null
    this.getPool = function() {
        let connectionUrl = `couchbase://${options.host}`;
        var cluster = new couchbase.Cluster();
        cluster.authenticate(options.username, options.password);
        // Will be creating the Bucket Instances once here
        pool = cluster.openBucket(options.bucket);
        return pool;
    }
};

CouchbaseStore.prototype.get = async function(sid) {
    console.log(" CouchbaseStore.prototype.get sid ", sid)
    let result = await this.getQueryPromise(sid);
    let session = null;
    if (result) {
        session = result;
    }
    return session
};
CouchbaseStore.prototype.set = async function(sid, session, ttl) {
    let data = session;
    console.log(" CouchbaseStore.prototype.set ttl ", ttl)
    let result = this.setQueryPromise(sid, data, parseInt(ttl));
    await result.then(res => {})
        .catch(err => {
            console.log(err);
        })
    return result
};
CouchbaseStore.prototype.destroy = async function(sid) {
    console.log(" CouchbaseStore.prototype.destroy sid ", sid)
    let result = await this.deleteQueryPromise(sid);
    // let session = null;
    // if (result) {
    //     session =result;
    // }
    // return session 
};

CouchbaseStore.prototype.getQueryPromise = async function(sid) {
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

CouchbaseStore.prototype.setQueryPromise = async function(sid, data, ttl = 5000) {
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
                    sid:sid
                }
                console.log("result for upsert", res);
                resolve(res);
            } else {
                reject(err);
            }
        });
    })
}

CouchbaseStore.prototype.deleteQueryPromise = async function(sid) {
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

module.exports = CouchbaseStore;