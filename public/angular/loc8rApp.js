let _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

let formatDistance = function () {
  return function (distance) {
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
};
let ratingStars = function () {
  return {
    scope: {
      thisRating: "=rating",
    },
    templateUrl: "/angular/rating-stars.html",
  };
};
let loc8rData = function ($http) {
  return $http.get("/api/locations?lng=61.2807&lat=55.1695&maxDistance=20000");
};
let locationListCtrl = function ($scope, loc8rData, geolocation) {
  $scope.message = "Searching for nearby places";
  loc8rData
    .success(function (data) {
      $scope.message = data.length > 0 ? "" : "No locations found";
      $scope.data = {
        locations: data,
      };
    })
    .error(function (e) {
      $scope.message = "Sorry, something's gone wrong ";
    });
};
let geolocation = function () {
  let getPosition = function (cbSuccess, cbError, cbNoGeo) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
    } else {
      cbNoGeo();
    }
  };
  return {
    getPosition: getPosition,
  };
};

angular
  .module("loc8rApp", [])
  .controller("locationListCtrl", locationListCtrl)
  .filter("formatDistance", formatDistance)
  .directive("ratingStars", ratingStars)
  .service("loc8rData", loc8rData)
  .service("geolocation", geolocation);
