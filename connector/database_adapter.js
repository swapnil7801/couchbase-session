"use strict";
const is = require("is-type-of");
const assert = require("assert");

class DatabaseAdapter {

    constructor(options) {
        this.store = options.store;
        if (this.store) {
            assert(is.function(this.store.get), "store.get must be function");
            assert(is.function(this.store.set), "store.set must be function");
            assert(is.function(this.store.destroy), "store.destroy must be function");
        } else {
            console.err("please specifuy database store");
        }
    }

    get(sid) {
        return this.store.get(sid);
    }
    set(sid, data, ttl) {
        return this.store.set(sid, data, ttl);
    }
}

module.exports = DatabaseAdapter;