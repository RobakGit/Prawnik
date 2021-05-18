const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema({
	id_prawnika: {
		type: String,
		required: false
	},
	przyjete: {
		type: Boolean,
		default: false
	},
	zakonczone: {
		type: Boolean,
		default: false
	},
	imie: {
		type: String,
		required: true
	},
	nazwisko: {
		type: String,
		required: true
	},
	adres: {
		type: String,
		required: true
	},
	kod_pocztowy: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: false
	},
	telefon: {
		type: String,
		required: false
	},
	data_full: {
		type: String,
		required: true
	},
	opis: {
		type: String,
		required: false
	},
	pliki: {
		type: String,
		required: false
	},
	date: {
		type: Date,
		default: Date.now
	}
});

const Case = mongoose.model("Case", CaseSchema);

module.exports = Case;