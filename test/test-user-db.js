"use strict";

var expect = require("chai").expect;
var userDb = require("../user-db").create();

describe("User db", function () {



    describe("test user creation", function () {

        beforeEach(function () {
            userDb.clearAll();
        });

        it("should be emtpy if there are no users", function () {
            expect(userDb.getAll()).to.eql([]);
            expect(userDb.getAll().length).to.eql(0);
        });

        it("should return 1 user if there is 1 user", function () {
            var testUser = { username: "test", name: "test name" };
            userDb.createUser(testUser, function (err) {
                expect(userDb.getAll()).to.eql([testUser]);
                expect(userDb.getAll().length).to.eql(1);
            });
        });

        it("should not create user if invalid", function () {
            var testUser = { bad_username: "test", name: "test name" };
            userDb.createUser(testUser, function (err) {
                expect(err).to.eql("Invalid user");
                expect(userDb.getAll().length).to.eql(0);
            });
        });

        it("should not create user if invalid", function () {
            var testUser = { username: "test", name: "test name" };
            userDb.createUser(testUser, function (err) { });
            userDb.createUser(testUser, function (err) {
                expect(err).to.eql("User already exist");
                expect(userDb.getAll().length).to.eql(1);
            });
        });
    });

    describe("test send message to user", function () {

        it("should return error if target user does not exist", function () {
            var testUser = { username: "test", name: "test name" };
            userDb.createUser(testUser, function (err) { });

            var user = userDb.findUserByUsername(testUser.username);

            var params = {
                token: user.token,
                username: "Bela",
                message: {
                    message: "...---..."
                }
            };

            userDb.sendMessageToUser(params, function (err) {
                expect(err).to.eql('User ' + params.username + ' does not exist!');
            });
        });

        it("receiver should get decoded message", function () {
            var sender = { username: "sender", name: "sender name" };
            userDb.createUser(sender, function (err) { });

            var receiver = { username: "receiver", name: "receiver name" };
            userDb.createUser(receiver, function (err) { });

            var senderUser = userDb.findUserByToken(sender.token);
            var receiverUserName = userDb.findUserByUsername(receiver.username);

            var params = {
                token: sender.token,
                username: receiver.username,
                message: {
                    message: "...---..."
                }
            };

            userDb.sendMessageToUser(params, function (err, data) {
                expect(data.from).to.eql(sender.name);
                expect(data.to).to.eql(receiver.name);
                expect(data.message).to.eql("SOS");

            });
        });
    });

    describe("test read user messages", function () {
        it("should return error if username is wrong", function () {

            var params = {
                token: "receiver123456",
                username: "bad_user"
            };

            userDb.readUserMessages(params, function (err) {
                expect(err).to.eql("Wrong username");
            });

        });

        it("should return error if token does not match user's token", function () {

            var params = {
                token: "bad_token",
                username: "receiver"
            };

            userDb.readUserMessages(params, function (err) {
                expect(err).to.eql("Wrong token");
            });

        });

        it("should return users messages", function () {

            var params = {
                token: "receiver123456",
                username: "receiver"
            };

            userDb.readUserMessages(params, function (err, data) {
                expect(data.length).to.eql(1);
                expect(data[0].from).to.eql("sender name");
                expect(data[0].to).to.eql("receiver name");
                expect(data[0].message).to.eql("SOS");
            });

        });
    });
});