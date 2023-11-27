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
  res.render("location-info", {
    title: "Starcups",
    pageHeader: { title: "Starcups" },
    sidebar: {
      context:
        "is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
      callToAction:
        "If you've been and you like it - or if you don't - please leave a review to help other people just like you.",
    },
    location: {
      name: "Starcups",
      address: "125 High Street, Reading, RG6 1PS",
      rating: 3,
      facilities: ["Hot drinks", "Food", "Premium wifi"],
      coords: { lat: 51.455041, lng: -0.9690884 },
      openingTimes: [
        {
          days: "Monday - Friday",
          opening: "7:00am",
          closing: "7:00pm",
          closed: false,
        },
        {
          days: "Saturday",
          opening: "8:00am",
          closing: "5:00pm",
          closed: false,
        },
        {
          days: "Sunday",
          closed: true,
        },
      ],
      reviews: [
        {
          author: "Simon Holmes",
          rating: 5,
          timestamp: "16 July 2013",
          reviewText:
            "What a great place. I can't say enough good things about it.",
        },
        {
          author: "Charlie Chaplin",
          rating: 3,
          timestamp: "16 June 2013",
          reviewText:
            "It was okay. Coffee wasn't great, but the wifi was fast.",
        },
      ],
    },
  });
};
/* GET 'add review' page. */

module.exports.addReview = function (req, res, next) {
  res.render("location-review-form", {
    title: "Review Starcups on Loc8r",
    pageHeader: { title: "Review Starcups" },
  });
};
