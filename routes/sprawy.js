const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const path = require("path");
const fs = require("fs");
const dir = require("../config/files");
const _ = require('lodash');

const data = require("../config/data");

// model sprawy
const Case = require("../models/Case");

router.get("/", ensureAuthenticated, (req, res) => {

    if (req.user.administrator == true) {
        data.listCases( (err, cases) => {
            res.render("sprawy", {
                title: "Sprawy",
                imie: req.user.imie,
                nazwisko: req.user.nazwisko,
                administrator: req.user.administrator,
                location: "sprawy",
                cases: cases
            });
            console.log(cases);
        })
    } else {
        req.logout();
        res.render("start", {
            title: "Opiekun prawny",
            error: "Nie jesteś administratorem!"
        });
    }

});

router.get("/add", ensureAuthenticated, (req, res) => {

    if (req.user.administrator == true) {
        data.listUsers((err, users) => {
            res.render("add", {
                title: "Dodawanie sprawy",
                imie: req.user.imie,
                nazwisko: req.user.nazwisko,
                administrator: req.user.administrator,
                location: "sprawy",
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

router.get("/:id", ensureAuthenticated, (req, res) => {

    data.findCase(req.params.id, (err, cases) => {

        if (err) {
           res.redirect("/panel");
        } else {

var directoryPath = path.join(dir.dir, cases.id);

        fs.readdir(directoryPath, function(err, files) {

  
            res.render("sprawa", {            
                    title: "Sprawa",
                    imie: req.user.imie,
                    nazwisko: req.user.nazwisko,
                    administrator: req.user.administrator,
                    status: req.user.status,
                    cases: cases,
                    files: files,
                    location: "sprawy"+req.path
                });
            });
    }
    });


});

// Tworzenie sprawy i przyjmowanie plików


router.post("/add", ensureAuthenticated, async (req, res) => {

    if (req.user.administrator == true) {

            var ts = Date.now();

            var date_ob = new Date(ts);
            if (date_ob.getDate()<10){
                var date = "0" + date_ob.getDate();
            } else{
                var date = date_ob.getDate();
            }
            var month = date_ob.getMonth() + 1;
            if (date_ob.getMonth()+1<10){
                month = "0" + month;
            } else{
                month = date_ob.getMonth() + 1;
            }
            var year = date_ob.getFullYear();

            const przyjete = false;
            const zakonczone = false;
            const data_full = `${date}.${month}.${year}`;
            let errors = [];
            let id_prawnika = "";
            let imie, nazwisko, adres, kod_pocztowy, email, telefon, opis, caseId;

            console.log(req.files);

            id_prawnika = req.body.id_prawnika;
            imie = req.body.imie;
            nazwisko = req.body.nazwisko;
            adres = req.body.adres;
            kod_pocztowy = req.body.kod_pocztowy;
            email = req.body.email;
            telefon = req.body.telefon;
            opis = req.body.opis;

            if (!imie || !nazwisko || !adres) {
                errors.push({ msg: "Proszę uzupełnić wszystkie pola" });
                console.log("blad");
            }

            if (errors.length > 0) {
                console.log("sa bledy");
            } else {
                const newCase = new Case({
                    id_prawnika,
                    przyjete,
                    zakonczone,
                    imie,
                    nazwisko,
                    adres,
                    kod_pocztowy,
                    email,
                    telefon,
                    data_full,
                    opis
                });

                newCase.save((err, cb) => {
                       if (err) return console.error(err);
                       console.log(cb.id + " Dodana sprawa");
                       caseId = cb.id;
                       fs.mkdirSync('pliki/' + caseId);


                       //upload plików
                       if(Array.isArray(req.files)){
                           try {
                            if(!req.files){
                                data.listCases( (err, cases) => {
                                    res.render("sprawy", {
                                        title: "Sprawy",
                                        imie: req.user.imie,
                                        nazwisko: req.user.nazwisko,
                                        administrator: req.user.administrator,
                                        location: "sprawy",
                                        cases: cases,
                                        error: "Nie dodano plików" 
                                    });
                                })
                            } else {
                                let files = [];

                                //loop all files
                                _.forEach(_.keysIn(req.files.fileUpload), (key) => {
                                    let file = req.files.fileUpload[key];

                                    //move file to uploads directory
                                    file.mv('pliki/' + caseId + "/" + file.name);

                                    //push file details
                                    files.push({
                                        name: file.name,
                                        mimetype: file.mimetype,
                                        size: file.size
                                        });
                                    });

                                //return response
                                data.listCases( (err, cases) => {
                                    res.render("sprawy", {
                                        title: "Sprawy",
                                        imie: req.user.imie,
                                        nazwisko: req.user.nazwisko,
                                        administrator: req.user.administrator,
                                        location: "sprawy",
                                        cases: cases,
                                        success_msg: "Dodano sprawę oraz pliki" 
                                    });
                                })
                            }
                        } catch (err) {
                            res.status(500).send(err);
                        }
                       }else{
                           try {
                            if(!req.files){
                                data.listCases( (err, cases) => {
                                    res.render("sprawy", {
                                        title: "Sprawy",
                                        imie: req.user.imie,
                                        nazwisko: req.user.nazwisko,
                                        administrator: req.user.administrator,
                                        location: "sprawy",
                                        cases: cases,
                                        error: "Nie dodano plików" 
                                    });
                                })
                            } else {
                                let file = req.files.fileUpload;

                                file.mv('pliki/' + caseId + "/" + file.name);
                                data.listCases( (err, cases) => {
                                    res.render("sprawy", {
                                        title: "Sprawy",
                                        imie: req.user.imie,
                                        nazwisko: req.user.nazwisko,
                                        administrator: req.user.administrator,
                                        location: "sprawy",
                                        cases: cases,
                                        success_msg: "Dodano sprawę oraz pliki" 
                                    });
                                })
                            }
                       } catch (err) {
                            res.status(500).send(err);
                        }
                   }

                        
                });

            
        }


    }
    

});

//Akceptowanie sprawy

router.get("/accept/:id", ensureAuthenticated, (req, res) => {

    data.findCase(req.params.id, (err, cases) => {
        cases.przyjete = true;

        data.updateCase(cases, function (err, data) {

            if (err){
                req.flash("error_msg", "Wystąpił błąd podczas przyjmowania sprawy");
                res.redirect(`/sprawy/${req.params.id}`);
            } else {
                req.flash("success_msg", "Pomyślnie przyjęto sprawę");
                res.redirect(`/sprawy/${req.params.id}`);
            }

        });
    });

});

//Odrzucanie sprawy

router.get("/reject/:id", ensureAuthenticated, (req, res) => {

    data.findCase(req.params.id, (err, cases) => {
        cases.id_prawnika = "";

        data.updateCase(cases, function (err, data) {

            if (err){
                req.flash("error_msg", "Wystąpił błąd podczas odczucania sprawy");
                res.redirect(`/sprawy/${req.params.id}`);
            } else {
                req.flash("success_msg", "Pomyślnie odrzucono sprawę");
                res.redirect(`/sprawy/${req.params.id}`);
            }

        });
    });

});

//Konczenie sprawy

router.get("/complete/:id", ensureAuthenticated, (req, res) => {

    data.findCase(req.params.id, (err, cases) => {
        cases.zakonczone = true;

        data.updateCase(cases, function (err, data) {

            if (err){
                req.flash("error_msg", "Wystąpił błąd podczas kończenia sprawy");
                res.redirect(`/sprawy/${req.params.id}`);
            } else {
                req.flash("success_msg", "Pomyślnie zakończono sprawę");
                res.redirect(`/sprawy/${req.params.id}`);
            }

        });
    });

});

//Serwowanie plików

router.get("/pliki/:id/:file", ensureAuthenticated, (req, res) => {

    var path = require('path');
    res.sendFile(path.resolve(`./pliki/${req.params.id}/${req.params.file}`));

});

//pobieranie plików

router.get("/pliki/download/:id/:file", ensureAuthenticated, (req, res) => {

    var path = require('path');
    var file = path.resolve(`./pliki/${req.params.id}/${req.params.file}`);
    res.download(file);

});

//odczyt dokumentów

router.get("/pliki/document/:id/:file", ensureAuthenticated, (req, res) => {

    var mammoth = require("mammoth");
     var path = require('path');
    mammoth.convertToHtml({path: path.resolve(`./pliki/${req.params.id}/${req.params.file}`)})
        .then(function(result){
            var html = result.value; // The generated HTML
            var messages = result.messages; // Any messages, such as warnings during conversion
            res.send(html);
        })
        .done();

});


module.exports = router;