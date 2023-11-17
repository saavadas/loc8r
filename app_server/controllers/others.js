/* GET 'about' page. */

module.exports.about = function (req, res, next) {
  res.render("generic-text", { title: "About" });
};
