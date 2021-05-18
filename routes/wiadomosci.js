const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

const data = require("../config/data");

const Message = require("../models/Message");


router.get("/", ensureAuthenticated, (req, res) => {
    if (req.query.box == "wyslane"){

        if (req.user.administrator == true) {
                data.listSendedMessagesBy(req.user.id, "Administracja", (err, messages) => {
                	res.render("wiadomosci", {
                                    title: "Wiadomości",
                                    imie: req.user.imie,
                                    nazwisko: req.user.nazwisko,
                                    administrator: req.user.administrator,
                                    location: "wiadomosci",
                                    messagesS: messages
                                });
                });
        } else {
                data.listSendedMessagesBy(req.user.id, req.user.id, (err, messages) => {
                    res.render("wiadomosci", {
                                    title: "Wiadomości",
                                    imie: req.user.imie,
                                    nazwisko: req.user.nazwisko,
                                    administrator: req.user.administrator,
                                    location: "wiadomosci",
                                    status: req.user.status,
                                    messagesS: messages
                                });
                });
        }

    } else {

        if (req.user.administrator == true) {
                data.listReceivedMessagesBy(req.user.id, "Administracja", (err, messages) => {
                    res.render("wiadomosci", {
                                    title: "Wiadomości",
                                    imie: req.user.imie,
                                    nazwisko: req.user.nazwisko,
                                    administrator: req.user.administrator,
                                    location: "wiadomosci",
                                    messagesR: messages
                                });
                });
        } else {
            data.listReceivedMessagesBy(req.user.id, req.user.id, (err, messages) => {
                    res.render("wiadomosci", {
                                    title: "Wiadomości",
                                    imie: req.user.imie,
                                    nazwisko: req.user.nazwisko,
                                    administrator: req.user.administrator,
                                    location: "wiadomosci",
                                    status: req.user.status,
                                    messagesR: messages
                                });
                });
        }
    }

});

router.get("/new", ensureAuthenticated, (req, res) => {

    data.listUsers((err, users) => {
        res.render("newMessage", {
            title: "Wiadomości",
            imie: req.user.imie,
            nazwisko: req.user.nazwisko,
            administrator: req.user.administrator,
            ja: req.user.id,
            status: req.user.status,
            location: "wiadomosci",
            ticket: req.query.ticket,
            users: users,
            re_id: req.query.id,
            re_title: req.query.title
        });
    });
});

//Odczyt wiadomosci

router.get("/:id", ensureAuthenticated, (req, res) => {

    data.findMessage(req.params.id, (err, messages) => {

            if (messages.odczytana == false && messages.odbiorca_id == req.user.id || messages.odczytana == false && req.user.administrator == true && messages.odbiorca_id == req.user.id || messages.odczytana == false && req.user.administrator == true && messages.odbiorca_id == "Administracja") {

                messages.odczytana = true;

                data.updateMessage(messages, function (err, data) {

                    if (err){
                        req.flash("error_msg", "Wystąpił błąd podczas odczytania wiadomości");
                        res.redirect(`/wiadomosci`);
                    } else {
                        res.render("wiadomosc", {
                            title: "Wiadomość",
                            imie: req.user.imie,
                            nazwisko: req.user.nazwisko,
                            administrator: req.user.administrator,
                            status: req.user.status,
                            location: "wiadomosci",
                            messages: messages
                        });
                    }

                });

            } else {
                res.render("wiadomosc", {
                    title: "Wiadomość",
                    imie: req.user.imie,
                    nazwisko: req.user.nazwisko,
                    administrator: req.user.administrator,
                    status: req.user.status,
                    location: "wiadomosci",
                    messages: messages
                });
            }

            
            
        });

});

//Wysyłanie wiadomości

router.post("/new", ensureAuthenticated, async (req, res) => {  
    let errors = [];
    nadawca_id = req.user.id;
    nadawca = req.user.imie+" "+req.user.nazwisko;
if (req.body.administracja !== 'Administracja'){
    odbiorca = req.body.odbiorca;
    odbiorca = odbiorca.split("|"); 
    odbiorca_id = odbiorca[0];
    odbiorca = odbiorca[1];
} else {
    odbiorca_id = "Administracja";
    odbiorca = "Administracja";
}
    tytul = req.body.title;
    tresc = req.body.tresc;

    if (!tytul || !tresc) {
        errors.push({ msg: "Proszę uzupełnić wszystkie pola" });
        console.log("blad");
    }

    if (errors.length > 0) {
                req.flash("error_msg", "Uzupełnij wszystkie pola!");
                if(req.query.ticket == "true"){
                res.redirect("/wiadomosci/new?ticket=true")
                }else{
                res.redirect("/wiadomosci/new")
                }
            } else {
                const newMessage = new Message({
                    nadawca_id,
                    nadawca,
                    odbiorca_id,
                    odbiorca,
                    tytul,
                    tresc
                });

                newMessage.save((err, cb) => {
                       if (err) return console.error(err);
                       console.log(cb.id + " Dodana wiadomość");
                       MessageId = cb.id;
                   });
                if (req.user.administrator == true) {
                    data.listReceivedMessagesBy(req.user.id, "Administracja", (err, messages) => {
                        res.render("wiadomosci", {
                                            title: "Wiadomości",
                                            imie: req.user.imie,
                                            nazwisko: req.user.nazwisko,
                                            administrator: req.user.administrator,
                                            status: req.user.status,
                                            location: "wiadomosci",
                                            messagesR: messages,
                                            success_msg: "Wysłano wiadomość" 
                                        });
                        });
                } else {
                    data.listReceivedMessagesBy(req.user.id, req.user.id, (err, messages) => {
                        res.render("wiadomosci", {
                                            title: "Wiadomości",
                                            imie: req.user.imie,
                                            nazwisko: req.user.nazwisko,
                                            administrator: req.user.administrator,
                                            status: req.user.status,
                                            location: "wiadomosci",
                                            messagesR: messages,
                                            success_msg: "Wysłano wiadomość" 
                                        });
                        });
                }
                };

});

// Usuwanie wiadomości

router.post("/remove", ensureAuthenticated, async (req, res) => {

    tablica = [];
    tablica = tablica.concat(req.body.remove);
    let doUsuniecia = [];
    doUkrycia_n = [];
    doUkrycia_o = [];
    success_msg = [];
    error_msg = [];
    j = 0;
    if (req.body.remove == null) {
        res.send(`null i chuj: ${tablica} <br> długość: ${tablica.length}`);
    } else {

        for(i=0; i<tablica.length; i++){

            data.findMessage(tablica[i], (err, messages) => {


                if(messages.nadawca_id == req.user.id && messages.odbiorca_id == req.user.id || req.user.administrator==true && messages.nadawca_id == req.user.id && messages.odbiorca_id == "Administracja"){

                    doUsuniecia.push(messages.id);

                } else if(messages.odbiorca_id == req.user.id || req.user.administrator==true && messages.odbiorca_id == "Administracja"){

                    if(messages.visiblity_n == false){

                        doUsuniecia.push(messages.id);

                    } else {

                        doUkrycia_o.push(messages.id);

                    }

                } else if (messages.nadawca_id = req.user.id) {

                    if(messages.visiblity_o == false){

                        doUsuniecia.push(messages.id);

                    } else {

                        doUkrycia_n.push(messages.id);

                    }
                    
                }
                j++;
                if(j==tablica.length){
                    console.log(`Do usunięcia: ${doUsuniecia} Do ukrycia dla nadawcy: ${doUkrycia_n} Do ukrycia dla odbiorcy: ${doUkrycia_o}`);
                    doUsuniecia = {_id: {$in: doUsuniecia }};
                    doUkrycia_n = {_id: {$in: doUkrycia_n }};
                    doUkrycia_o = {_id: {$in: doUkrycia_o }};

                    data.deleteMessages(doUsuniecia, (err, messages) => {

                        if(err){
                            req.flash("error_msg", "Wystąpił błąd podczas usuwania wiadomości");
                            res.redirect("/wiadomosci")
                        } else {
                            data.hideMessages_n(doUkrycia_n, (err, messages) => {

                                if(err){
                                    req.flash("error_msg", "Wystąpił błąd podczas usuwania wiadomości nadanych");
                                    res.redirect("/wiadomosci")
                                } else {
                                    data.hideMessages_o(doUkrycia_o, (err, messages) => {

                                        if(err){
                                            req.flash("error_msg", "Wystąpił błąd podczas usuwania wiadomości odebranych");
                                            res.redirect("/wiadomosci")
                                        } else {
                                            req.flash("success_msg", "Usunięto wiadomości");
                                            res.redirect("/wiadomosci")
                                        }

                                    });
                                }

                            });
                        }

                    });
                }

            });

        }

    }

});

module.exports = router;