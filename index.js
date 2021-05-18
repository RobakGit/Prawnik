const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const moment = require('moment');

// Passport config
require("./config/passport")(passport);

// DB Config
const db = require("./config/keys").MongoURI;

// Połączenie z Mongo
mongoose.connect(db, { 
	useNewUrlParser: true,
	useUnifiedTopology: true
 })
	.then(() => console.log("Połączono z MongoDB..."))
	.catch(err => console.log(err));

// Handlebars layout
app.engine("handlebars", hbs({
	defaultLayout: "main",

	helpers: {

		if_eq: (a, b, opts) => {
			if (a == b) {
				return opts.fn(this);
			} else {
				return opts.inverse(this);
			}
		},

		limit_znakow: (a, str) =>{
			if (str.length > a){
    		return str.substring(0,a) + '...';
    		}
  			return str;
		},

		if_obraz: (a, opts) => {
			a = a.split(".")[1];
			if (a == "jpg" || a == "png") {
				return opts.fn(this);
			} else {
				return opts.inverse(this);
			}
		},

		if_document: (a, opts) => {
			a = a.split(".")[1];
			if (a == "doc" || a == "docx") {
				return opts.fn(this);
			} else {
				return opts.inverse(this);
			}
		},
		date: (dateTime) => {
			return moment(dateTime).format('D.MM.YYYY H:mm');
		}
	}
}));
app.set("view engine", "handlebars");

// Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(morgan('dev'));

// Express Session
app.use(session({
  secret: 'anything',
  resave: true,
  saveUninitialized: true,
}));

// Passport middlerware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Zmienne globalne
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

// Statyczne skrypty, style, czcionki itd.
app.use( express.static("public") );
app.use( express.static("pliki") );



// Routing
app.use("/", require("./routes/index"));
app.use("/status", require("./routes/menu"));
app.use("/panel", require("./routes/panel"));
app.use("/wiadomosci", require("./routes/wiadomosci"));
app.use("/uzytkownicy", require("./routes/uzytkownicy"));
app.use("/sprawy", require("./routes/sprawy"));

app.listen(80, function() {

    console.log("Serwer został uruchomiony pod adresem http://localhost:80");

});