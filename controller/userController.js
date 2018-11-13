"use strict";
const serviceConfig = require(`../config/serviceConfig`);
const appRoot = require('app-root-path');
const serviceBasePath = `service`;
const genericApi = require(`../service/genericApi`);
let _ = require("lodash");

class userController {
    constructor() {
        this.traverse(serviceConfig);
    }
    traverse(object) {
        _.forOwn(object, (value, key) => {
            if (key === "service") {
                object["service"] = require(`${appRoot}/${serviceBasePath}/${object[key]}`);
            }
            if (object[key] !== null && typeof(object[key]) === "object") {
                //going on step down in the object tree!!
                this.traverse(object[key]);
            }
        });
    }
    getSessionDataFromService(id, servConfig) {
        let ttl = servConfig["ttl"];
        let serviceObj = new servConfig["service"];
        return serviceObj.getSessionData(id, ttl);
    }
    getGenericDataFromService(id, serviceUri, servConfig) {
        let ttl = servConfig["ttl"];
        let genericApiObject = new genericApi();
        return genericApiObject.getSession(id, serviceUri, ttl);
    }
    serviceNotfound() {
        return new Promise((resolve, reject) => {
            resolve('service configuration not found');
        })
    }
    execute(req) {
        let current_base_uri = "users";
        let current_dynamic_uri = req.params.uri;
        const servConfig = serviceConfig[current_base_uri][current_dynamic_uri];
        if (servConfig) {
            const serviceKey = servConfig["service"];
            const serviceUri = servConfig["serviceUri"];
            if (serviceKey) {
                return this.getSessionDataFromService(req.params.id, servConfig);
            } else if (serviceUri) {
                return this.getGenericDataFromService(req.params.id, serviceUri, servConfig);
            }
        } else {
            return this.serviceNotfound();
        }
    }
}

module.exports = userController;