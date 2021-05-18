const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

const data = require("../config/data");


router.get("/", ensureAuthenticated, (req, res) => {

	if (req.user.administrator == true) {
        data.listUsers((err, users) => {
            data.listCases((err, cases) => {
		        res.render("dashboard", {
        	        title: "Panel główny",
        	        imie: req.user.imie,
        	        nazwisko: req.user.nazwisko,
        	        administrator: req.user.administrator,
        	        location: "panel",
                    users: users,
                    cases: cases
                });
            });

    });
	} else {
        data.listCasesBy(req.user.id, (err, cases) => {
    	    res.render("dashboard", {            
        	    title: "Panel główny",
        	    imie: req.user.imie,
        	    nazwisko: req.user.nazwisko,
        	    status: req.user.status,
        	    location: "panel",
                cases: cases
            });
    });
}

});

module.exports = router;