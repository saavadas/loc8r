var mongoose = require("mongoose");
var Loc = mongoose.model("Location");
var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};
module.exports.reviewsCreate = function (req, res, next) {
  sendJSONresponse(res, 403, "NOT WORKING");
  /*
  var locationid = req.params.locationid;
  const filter = { _id: locationid };
  const options = { upsert: true };
  const review = {
    author: req.body.author,
    rating: req.body.rating,
    reviewText: req.body.reviewText,
  };
  const updateDoc = {
    $set: {
      reviews: review,
    },
  };
  try {
    const result = Loc.updateOne(filter, updateDoc);
    console.log(
      `${result.matchedCount} document(s) ${result}matched the filter, updated ${result.modifiedCount} document(s)`
    );
    sendJSONresponse(res, 200, "done");
  } catch (err) {
    console.log(err);
    sendJSONresponse(res, 400, err);
  }
  /*try {
    Loc.locations.updateOne(
      { _id: locationid },
      {
        $addToSet: {
          reviews: {
            $each: [
              {
                author: req.body.author,
                rating: req.body.rating,
                reviewText: req.body.reviewText,
              },
            ],
          },
        },
      }
    );
  } catch (err) {
    console.log("here");
    sendJSONresponse(res, 400, err);
  }*/
  /*if (locationid) {
    Loc.findById(locationid)
      .select("reviews")
      .exec(function (err, location) {
        if (err) {
          sendJSONresponse(res, 400, err);
        } else {
          sendJSONresponse(res, 200, location);
          // doAddReview(req, res, location);
        }
      });
  } else {
    sendJSONresponse(res, 404, {
      message: "Not found, locationid required",
    });
  }*/
};

module.exports.reviewsReadOne = function (req, res) {
  if (req.params && req.params.locationid && req.params.reviewid) {
    Loc.findById(req.params.locationid)
      .select("name reviews")
      .exec(function (err, location) {
        if (!location) {
          sendJSONresponse(res, 404, {
            message: "locationid not found",
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 404, err);
          return;
        }
        var response, review;
        if (location.reviews && location.reviews.length > 0) {
          review = location.reviews.id(req.params.reviewid);
          if (!review) {
            sendJSONresponse(res, 404, {
              message: "reviewid not found",
            });
          } else {
            response = {
              location: {
                name: location.name,
                id: req.params.locationid,
              },
              review: review,
            };
            sendJSONresponse(res, 200, response);
          }
        } else {
          sendJSONresponse(res, 404, {
            message: "No reviews found",
          });
        }
      });
  } else {
    sendJSONresponse(res, 404, {
      message: "No locationid in request",
    });
  }
};
module.exports.reviewsUpdateOne = function (req, res) {};
module.exports.reviewsDeleteOne = function (req, res) {};
