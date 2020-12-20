import chai from "chai";
import chaiHttp from "chai-http";
import { dropDB } from "../../config/db"
import server from "../../server";
import {
    user,
    user2,
    user3,
    user4,
    profile
} from "./user-test-data";


chai.should();
chai.use(chaiHttp);


describe("Should handle correct user's behaviour", async () => {
    before(async () => {  
        await dropDB("CI_lesson_test");
    });

    describe("/user/signup should create a user", () => {
        it("it should create a user with complete details successfully", (done) => {
          chai
            .request(server)
            .post("/user/signup")
            .set("Accept", "application/json")
            .send(user)
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a("object");
              res.body.should.have.property("success").eql(true);
              res.body.should.have.property("message").eql("New User Created Successfully");
              done();
            });
        });
    
        it("it should not create a user with an already taken username", done => {
            chai
            .request(server)
            .post("/user/signup")
            .set("Accept", "application/json")
            .send(user4)
            .end((err, res) => {
                res.should.have.status(409);
                done();
              });
        });
        it("it should not create a user with an already registered email", done => {
            chai
              .request(server)
              .post("/user/signup")
              .set("Accept", "application/json")
              .send(user2)
              .end((err, res) => {
                res.should.have.status(409);
                done();
              });
        });
    });
    describe("/users should get all registered users", () => {
        it("it should get all registered users", (done) => {
            chai
            .request(server)
            .get("/users")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("All Users Retrieved Successfully");
                done();
            });
        });
    });
    describe("Handle single user  operations", () => {
        let _id;
        before(done => {
            chai
            .request(server)
            .post("/user/signup")
            .set("Accept", "application/json")
            .send(user3)
            .end((err, res) => {
                if (err) throw err;
                _id = res.body.data._id;
                done();
            });
        });
        it("it should update a user's profile", (done) => {
            chai
              .request(server)
              .patch(`/user/profile/${_id}`)
              .set("Accept", "application/json")
              .send(profile)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eql("User Details Uploaded");
                done();
            });
        });
        it("it should get a single user by ID", (done) => {
            chai
            .request(server)
            .get(`/user/${_id}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("User retrieved!");
                done();
            });
        });
        it("it should delete a user's account", (done) => {
            chai
              .request(server)
              .delete(`/user/delete/${_id}`)
              .set("Accept", "application/json")
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eql("User Account deleted");
                done();
            });
        });
    });
    // after(async () => {  
    //     await dropDB("CI_lesson_test");
    //   });
});