const supertest = require("supertest");
const should = require("should");

// This agent refers to PORT where program is runninng.

let server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("session data for couchbase", function() {
    // #1 should return home page

    it("should return home page", function(done) {
        server
            .get("/")
        // .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err, res) {
                console.log("err", err);
                // HTTP status should be 200
                res.status.should.equal(200);
                // Error key should be false.
                // res.body.error.should.equal(false);
                done();
            });
    });
    it("should get user session,save it in couchbase and display it", function(done) {
        server
            .get("/users/session/")
        // .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err, res) {
                console.log("err", err);
                console.log("res",res.body.sid);
                // HTTP status should be 200
                res.status.should.equal(200);
                res.body.sid.should.not.equal(null);

                // Error key should be false.
                // res.body.error.should.equal(false);
                done();
            });
    });
    it("should call a generic api and save it in couchbase and return a valid session key", function(done) {
        server
            .get("/users/getMetaLinks")
        // .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err, res) {
                console.log("err", err);
                // console.log("res",res);
                // HTTP status should be 200
                res.status.should.equal(200);
                res.body.sid.should.not.equal(null);
                // Error key should be false.
                // res.body.error.should.equal(false);
                done();
            });
    });

});