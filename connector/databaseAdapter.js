"use strict";
const is = require("is-type-of");
const assert = require("assert");

class DatabaseAdapter {
    constructor(options) {
        this.store = options.store;
        if (this.store) {
            assert(is.function(this.store.getSession), "store.get must be function");
            assert(is.function(this.store.setSession), "store.set must be function");
            assert(is.function(this.store.destroySession), "store.destroy must be function");
        } else {
            console.err("please specifuy database store");
        }
    }
    getSession(sid) {
        return this.store.getSession(sid);
    }
    setSession(sid, data, ttl) {
        return this.store.setSession(sid, data, ttl);
    }
}

module.exports = DatabaseAdapter;