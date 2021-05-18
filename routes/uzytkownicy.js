const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { ensureAuthenticated } = require("../config/auth");

// Config z funkcjami wyciagajacymi dane
const data = require("../config/data");

// model użytkownika
const User = require("../models/User");

router.get("/", ensureAuthenticated, (req, res) => {

	if (req.user.administrator == true) {
        data.listUsers((err, users) => {
		    res.render("users", {
        	    title: "Użytkownicy",
        	    imie: req.user.imie,
        	    nazwisko: req.user.nazwisko,
        	    administrator: req.user.administrator,
        	    location: "uzytkownicy",
                users: users
            });

    });
	} else {
        req.logout();
    	res.render("start", {
        	title: "Opiekun prawny",
        	error: "Nie jesteś administratorem!"
        });
    }

});

// Rejestracja użytkownika

router.post("/", ensureAuthenticated, (req, res) => {

    if (req.user.administrator == true) {

        console.log(req.body);

        var ts = Date.now();

        var date_ob = new Date(ts);
        var date = date_ob.getDate();
        var month = date_ob.getMonth() + 1;
        var year = date_ob.getFullYear();

        const { login, password, password2, imie, nazwisko, miejscowosc, email, telefon, rola } = req.body;
        const status = false;
        const rejestracja = `${date}.${month}.${year}`;
        const logowanie = "0";
        let administrator = false;
        let errors = [];

        //Sprawdzenie wymaganych pól
        if (!login || !password || !password2 || !imie || !nazwisko || !miejscowosc || !email || !telefon || !rola) {
            errors.push({ msg: "Proszę uzupełnić wszystkie pola" });
        }    

        // Sprawdzenie czy hasła do siebie pasuja
        if (password !== password2) {
            errors.push({ msg: "Hasła nie pasują do siebie" });
        }

        // Sprawdzenie dlugosci hasla
        if (password.length < 6) {
            errors.push({ msg: "Hasło powinno zawierać przynajmniej 6 znaków" });
        }

        if (errors.length > 0) {
            data.listUsers((err, users) => {
                res.render("users", {
                    title: "Użytkownicy",
                    imie: req.user.imie,
                    nazwisko: req.user.nazwisko,
                    administrator: req.user.administrator,
                    location: "uzytkownicy",
                    users: users,
                    login,
                    imie_f: imie,
                    nazwisko_f: nazwisko,
                    miejscowosc,
                    email,
                    telefon,
                    errors
                });
            });
        } else {
            // Udana validacja
            User.findOne({ login: login })
                .then(user => {
                    if (user) {
                        // Uzytkownik istnieje
                        errors.push({ msg: "Login jest już zarejestrowany" })
                        data.listUsers((err, users) => {
                            res.render("users", {
                                title: "Użytkownicy",
                                imie: req.user.imie,
                                nazwisko: req.user.nazwisko,
                                administrator: req.user.administrator,
                                location: "uzytkownicy",
                                users: users,
                                errors
                            });
                        });
                    } else {
                        if (rola === "Administrator") {
                            administrator = true;
                        }
                        const newUser = new User({
                            login,
                            password,
                            imie,
                            nazwisko,
                            miejscowosc,
                            email,
                            telefon,
                            rola,
                            administrator,
                            status,
                            rejestracja,
                            logowanie
                        });

                        // Hashowanie hasła
                        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // ustawienie hasła na zahaszowane
                            newUser.password = hash;
                            // zapisanie uzytkownika
                            newUser.save()
                                .then(user => {
                                    req.flash("success_msg", "Zarejestrowano użytkownika");
                                    res.redirect("/uzytkownicy")
                                })
                                .catch(err => console.log(err));
                        }))
                        
                    }
                });
        }
    } else {
        req.logout();
            res.render("start", {
                title: "Opiekun prawny",
                error: "Nie jesteś administratorem!",
        });
    }

});

// Usuwanie użytkownika

router.get("/remove/:id", ensureAuthenticated, function(req, res) {

    if (req.user.administrator == true) {

    data.deleteUser(req.params.id, function (err, data) {

        if(err){
            req.flash("error_msg", "Wystąpił błąd podczas usuwaia użytkownika");
            res.redirect("/uzytkownicy")
        } else {
            req.flash("success_msg", "Usunięto użytkownika");
            res.redirect("/uzytkownicy")
        }

    });
} else {
    req.logout();
        res.render("start", {
            title: "Opiekun prawny",
            error: "Nie jesteś administratorem!",
    });
}

});

module.exports = router;