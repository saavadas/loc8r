var mongoose = require("mongoose");
var Loc = mongoose.model("Location");
var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};
module.exports.locationsListByDistance = function (req, res) {
  sendJsonResponse(res, 200, { status: "success" });
};
module.exports.locationsCreate = function (req, res) {
  sendJsonResponse(res, 200, { status: "postsuccess" });
};
module.exports.locationsReadOne = function (req, res) {
  Loc.findById(req.params.locationid).exec(function(err, location){
    sendJsonResponse(res,200,location); 
  })
};
module.exports.locationsUpdateOne = function (req, res) {};
module.exports.locationsDeleteOne = function (req, res) {};
