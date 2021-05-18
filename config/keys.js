const DB_USER = "*";
const DB_PASSWORD = "*";
const DB_NAME = "prawnicy";

module.exports = {
	MongoURI: `mongodb://${DB_USER}:${DB_PASSWORD}@localhost/${DB_NAME}`
}