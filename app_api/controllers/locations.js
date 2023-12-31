var mongoose = require("mongoose");
var Loc = mongoose.model("Location");
var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};
module.exports.locationsListByDistance = function (req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);
  var point = {
    type: "Point",
    coordinates: [lng, lat],
  };
  if (!lng || !lat || !maxDistance) {
    console.log("locationsListByDistance missing params");
    sendJSONresponse(res, 404, {
      message: "lng, lat and maxDistance query parameters are all required",
    });
    return;
  }
  Loc.aggregate(
    [
      {
        $geoNear: {
          near: point,
          spherical: true,
          distanceField: "dist",
          maxDistance: maxDistance,
        },
      },
    ],
    function (err, results) {
      var locations = [];
      // console.log(results);
      if (err) {
        sendJSONresponse(res, 404, err);
      } else {
        results.forEach(function (doc) {
          // console.log(doc);
          locations.push({
            distance: doc.dist,
            name: doc.name,
            address: doc.address,
            rating: doc.rating,
            facilities: doc.facilities,
            _id: doc._id,
          });
        });
        sendJSONresponse(res, 200, locations);
      }
    }
  );
};
var buildLocationList = function (req, res, results) {
  console.log("buildLocationList:");
  var locations = [];
  results.forEach(function (doc) {
    locations.push({
      distance: doc.dist,
      name: doc.name,
      address: doc.address,
      rating: doc.rating,
      facilities: doc.facilities,
      _id: doc._id,
    });
  });
  return locations;
};
module.exports.locationsCreate = function (req, res) {
  Loc.create(
    {
      name: req.body.name,
      address: req.body.address,
      facilities: req.body.facilities.split(","),
      coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
      openingTimes: [
        {
          days: req.body.days,
          opening: req.body.opening,
          closing: req.body.closing,
          closed: req.body.closed,
        },
      ],
    },
    function (err, location) {
      if (err) {
        sendJSONresponse(res, 400, err);
      } else {
        sendJSONresponse(res, 201, location);
      }
    }
  );
};
module.exports.locationsReadOne = function (req, res) {
  if (req.params && req.params.locationid) {
    Loc.findById(req.params.locationid).exec(function (err, location) {
      if (!location) {
        sendJSONresponse(res, 404, {
          message: "locationid not found",
        });
        return;
      } else if (err) {
        sendJSONresponse(res, 404, err);
        return;
      }
      sendJSONresponse(res, 200, location);
    });
  } else {
    sendJSONresponse(res, 404, {
      message: "No locationid in request",
    });
  }
};
module.exports.locationsUpdateOne = function (req, res) {
  if (!req.params.locationid) {
    sendJSONresponse(res, 404, {
      message: "Not found, locationid is required",
    });
    return;
  }
  Loc.findById(req.params.locationid)
    .select("-reviews -rating")
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
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(",");
      location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
      location.openingTimes = [
        {
          days: req.body.days1,
          opening: req.body.opening1,
          closing: req.body.closing1,
          closed: req.body.closed1,
        },
        {
          days: req.body.days2,
          opening: req.body.opening2,
          closing: req.body.closing2,
          closed: req.body.closed2,
        },
      ];
      location.save(function (err, location) {
        if (err) {
          sendJSONresponse(res, 404, err);
        } else {
          sendJSONresponse(res, 200, location);
        }
      });
    });
};
module.exports.locationsDeleteOne = function (req, res) {
  var locationid = req.params.locationid;
  if (locationid) {
    Loc.findByIdAndRemove(locationid).exec(function (err, location) {
      if (err) {
        sendJSONresponse(res, 404, err);
        return;
      }
      sendJSONresponse(res, 204, null);
    });
  } else {
    sendJSONresponse(res, 404, {
      message: "No locationid",
    });
  }
};
