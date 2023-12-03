var mongoose = require("mongoose");
var Loc = mongoose.model("Location");
var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};
module.exports.reviewsCreate = function (req, res) {
  var locationid = req.params.locationid;
  if (locationid) {
    Loc.findById(locationid)
      .select("reviews")
      .exec(function (err, location) {
        if (err) {
          sendJSONresponse(res, 400, err);
        } else {
          doAddReview(req, res, location);
        }
      });
  } else {
    sendJSONresponse(res, 404, {
      message: "Not found, locationid required",
    });
  }
  // sendJSONresponse(res, 403, "NOT WORKING");
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
let doAddReview = function (req, res, location) {
  if (!location) {
    sendJSONresponse(res, 404, {
      message: "locationid not found",
    });
  } else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText,
    });
    location.save(function (err, location) {
      let thisReview;
      if (err) {
        sendJSONresponse(res, 400, err);
      } else {
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];
        sendJSONresponse(res, 201, thisReview);
      }
    });
  }
};
let updateAverageRating = function (locationid) {
  Loc.findById(locationid)
    .select("rating reviews")
    .exec(function (err, location) {
      if (!err) {
        doSetAverageRating(location);
      }
    });
};
let doSetAverageRating = function (location) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
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
module.exports.reviewsUpdateOne = function (req, res) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJSONresponse(res, 404, {
      message: "Not found, locationid and reviewid are both required",
    });
    return;
  }
  Loc.findById(req.params.locationid)
    .select("reviews")
    .exec(function (err, location) {
      var thisReview;
      if (!location) {
        sendJSONresponse(res, 404, {
          message: "locationid not found",
        });
        return;
      } else if (err) {
        sendJSONresponse(res, 400, err);
        return;
      }
      if (location.reviews && location.reviews.length > 0) {
        thisReview = location.reviews.id(req.params.reviewid);
        if (!thisReview) {
          sendJSONresponse(res, 404, {
            message: "reviewid not found",
          });
        } else {
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save(function (err, location) {
            if (err) {
              sendJSONresponse(res, 404, err);
            } else {
              updateAverageRating(location._id);
              sendJSONresponse(res, 200, thisReview);
            }
          });
        }
      } else {
        sendJSONresponse(res, 404, {
          message: "No review to update",
        });
      }
    });
};
module.exports.reviewsDeleteOne = function (req, res) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJSONresponse(res, 404, {
      message: "Not found, locationid and reviewid are both required",
    });
    return;
  }
  Loc.findById(req.params.locationid)
    .select("reviews")
    .exec(function (err, location) {
      if (!location) {
        sendJSONresponse(res, 404, {
          message: "locationid not found",
        });
        return;
      } else if (err) {
        sendJSONresponse(res, 400, err);
        return;
      }
      if (location.reviews && location.reviews.length > 0) {
        if (!location.reviews.id(req.params.reviewid)) {
          sendJSONresponse(res, 404, {
            message: "reviewid not found",
          });
        } else {
          location.reviews.id(req.params.reviewid).remove();
          location.save(function (err) {
            if (err) {
              sendJSONresponse(res, 404, err);
            } else {
              updateAverageRating(location._id);
              sendJSONresponse(res, 204, null);
            }
          });
        }
      } else {
        sendJSONresponse(res, 404, {
          message: "No review to delete",
        });
      }
    });
};
