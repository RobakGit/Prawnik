const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	login: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	imie: {
		type: String,
		required: true
	},
	nazwisko: {
		type: String,
		required: true
	},
	miejscowosc: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	telefon: {
		type: String,
		required: true
	},
	rola: {
		type: String,
		required: true
	},
	administrator: {
		type: Boolean,
		required: true
	},
	status: {
		type: Boolean,
		required: true
	},
	rejestracja: {
		type: String,
		required: true
	},
	logowanie: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

const User = mongoose.model("User", UserSchema);

module.exports = User;