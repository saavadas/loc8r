require("dotenv").config();

let request = require("request");
const apiOptions = {
  server: process.env.SERVER,
};
/* GET 'home' page. */
let renderHomepage = function (req, res, responseBody) {
  let message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else if (!responseBody.length) {
    message = "No places found nearby";
  }
  try {
    res.render("locations-list", {
      title: "Loc8r - find a place to work with wifi",
      pageHeader: {
        title: "Loc8r",
        strapline: "Find places to work with wifi near you",
      },
      sidebar:
        "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
      locations: responseBody,
      message: message,
    });
  } catch (err) {
    console.log(err);
  }
};
let _distanceValue = function (distance) {
  let numDistance, unit;
  if (distance > 1000) {
    numDistance = parseFloat(distance / 1000).toFixed(1);
    unit = "km";
  } else {
    numDistance = parseInt(distance, 10);
    unit = "m";
  }
  return numDistance + unit;
};
module.exports.homeList = function (req, res, body) {
  const path = "/api/locations";
  const requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
    qs: {
      lng: 61.282162,
      lat: 55.169677,
      maxDistance: 20000,
    },
  };
  request(requestOptions, function (err, response, body) {
    let data = body;
    if (response.statusCode === 200 && data.length) {
      for (let i = 0; i < data.length; i++) {
        data[i].distance = _distanceValue(data[i].distance);
      }
    }
    renderHomepage(req, res, data);
    /*if (err) {
      //throw err
    } else if (response.statusCode === 200) {
      //all fine
    } else {
      //throw err
    )*/
  });
};

/* GET 'location info' page. */

module.exports.locationInfo = function (req, res, next) {
  let requestOptions, path;
  path = "/api/locations/" + req.params.locationid;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {},
  };
  request(requestOptions, function (err, response, body) {
    var data = body;
    if (response.statusCode === 200) {
      renderDetailPage(req, res, data);
    } else {
      _showError(req, res, response.statusCode);
    }
  });
};
let _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render("generic-text", {
    title: title,
    content: content,
  });
};

let renderDetailPage = function (req, res, locDetail) {
  res.render("location-info", {
    title: locDetail.name,
    pageHeader: { title: locDetail.name },
    sidebar: {
      context:
        "is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
      callToAction:
        "If you've been and you like it - or if you don't - please leave a review to help other people just like you.",
    },
    location: locDetail,
  });
};
/* GET 'add review' page. */

module.exports.addReview = function (req, res, next) {
  res.render("location-review-form", {
    title: "Review Starcups on Loc8r",
    pageHeader: { title: "Review Starcups" },
  });
};
module.exports.doAddReview = function (req, res) {};
