const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
	nadawca_id: {
		type: String,
		required: true
	},
	nadawca: {
		type: String,
		required: true
	},
	odbiorca_id: {
		type: String,
		required: true
	},
	odbiorca: {
		type: String,
		required: true
	},
	visiblity_n: {
		type: Boolean,
		default: true
	},
	visiblity_o: {
		type: Boolean,
		default: true
	},
	tytul: {
		type: String,
		required: true
	},
	tresc: {
		type: String,
		required: true
	},
	odczytana:{
		type: Boolean,
		default: false
	},
	date: {
		type: Date,
		default: Date.now
	}
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;