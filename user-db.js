'use strict';

var morseDecoder = require("./morse-decoder");

class UserDB {

	constructor() {
		this._users = [];
	}

	createUser(user, cb) {
		if (!this.checkIfValidUser(user)) {
			return cb("Invalid user");
		}

		if (this.checkIfUserExist(user)) {
			return cb("User already exist");
		}

		this.storeUser(user);
		return cb(null, this.getUserToken(user));
	}

	createUserToken(user) {
		return user.username + "123456";
	}

	getUserToken(user) {
		return user.token;
	}

	storeUser(user) {
		user.messages = [];
		user.token = this.createUserToken(user);
		this._users.push(user);
	}

	checkIfValidUser(user) {
		return user.username ? true : false;
	}

	checkIfUserExist(user) {
		return this.findUser(user) ? true : false;
	}

	sendMessageToUser(params, cb) {
		var targetUser = this.findUserByUsername(params.username);
		if (!targetUser) {
			return cb('User ' + params.username + ' does not exist!')
		}
		var message = this.createMessageObject(params, targetUser);

		targetUser.messages.push(message);
		return cb(null, message);
	}

	createMessageObject(params, targetUser) {
		var token = params.token;
		var user = this.findUserByToken(token);
		var messageObject = params.message;

		return {
			from: user.name ? user.name : user.username,
			to: targetUser.name ? targetUser.name : username,
			message: morseDecoder.decodeMessage(messageObject.message)
		};

	}

	readUserMessages(params, cb) {
		var username = params.username;
		var token = params.token;

		if (!this.findUserByUsername(username))
			return cb('Wrong username');

		if (!this.isTokenValid(token))
			return cb("Wrong token");

		var user = this.findUserByToken(token);

		if (user.username !== username) {
			return cb("Access denied");
		}

		return cb(null, user.messages);
	}

	findUser(targetUser) {
		return this._users.find(user => user.username === targetUser.username);
	}

	findUserByUsername(username) {
		return this._users.find(user => user.username === username);
	}

	findUserByToken(token) {
		return this._users.find(user => user.token === token);
	}

	isTokenValid(token) {
		return this.findUserByToken(token) !== undefined;
	}

	generateToken(user) {
		return user.username + "123456";
	}

	getAll() {
		return this._users;
	}

	clearAll() {
		this._users = [];
	}

	static create() {
		return new UserDB();
	}
}

module.exports = UserDB;