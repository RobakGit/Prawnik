module.exports = {
	ensureAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash("error_msg", "Zaloguj się aby zobaczyć zawartość");
		res.redirect("/");
	}
}