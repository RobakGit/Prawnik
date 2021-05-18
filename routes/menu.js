const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

const data = require("../config/data");


// Zmiana statusu na true, czyli, że chce przyjmować zlecenia

router.get("/true/:location", ensureAuthenticated, (req, res) => {

    req.user.status = true;
    data.updateUser(req.user, function (err, data) {

        if (err){
            req.flash("error_msg", "Wystąpił błąd podczas zmiany statusu");
            res.redirect(`/${req.params.location}`);
        } else {
            req.flash("success_msg", "Pomyślnie zmieniono status");
            res.redirect(`/${req.params.location}`);
        }

    });
    

});

// Zmiana statusu na false, czyli, że nie chce przyjmować zlecen

router.get("/false/:location", ensureAuthenticated, (req, res) => {

    req.user.status = false;
    data.updateUser(req.user, function (err, data) {

        if (err){
            req.flash("error_msg", "Wystąpił błąd podczas zmiany statusu");
            res.redirect(`/${req.params.location}`);
        } else {
            req.flash("success_msg", "Pomyślnie zmieniono status");
            res.redirect(`/${req.params.location}`);
        }

    });

});

//To samo tylko na pod stronach np. sprawy/:id

router.get("/true/:location/:id", ensureAuthenticated, (req, res) => {

    req.user.status = true;
    data.updateUser(req.user, function (err, data) {

        if (err){
            req.flash("error_msg", "Wystąpił błąd podczas zmiany statusu");
            res.redirect(`/${req.params.location}/${req.params.id}`);
        } else {
            req.flash("success_msg", "Pomyślnie zmieniono status");
            res.redirect(`/${req.params.location}/${req.params.id}`);
        }

    });
    

});

router.get("/false/:location/:id", ensureAuthenticated, (req, res) => {

    req.user.status = false;
    data.updateUser(req.user, function (err, data) {

        if (err){
            req.flash("error_msg", "Wystąpił błąd podczas zmiany statusu");
            res.redirect(`/${req.params.location}/${req.params.id}`);
        } else {
            req.flash("success_msg", "Pomyślnie zmieniono status");
            res.redirect(`/${req.params.location}/${req.params.id}`);
        }

    });

});

module.exports = router;