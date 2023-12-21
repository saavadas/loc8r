var mongoose = require("mongoose");

var openingTimeSchema = mongoose.Schema({
  days: { type: String, required: true },
  opening: String,
  closing: String,
  closed: { type: Boolean, required: true },
});

var reviewSchema = mongoose.Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true, default: 0, min: 0, max: 5 },
  reviewText: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});

var locationSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  rating: { type: Number, default: 0, min: 0, max: 5 },
  facilities: [String],
  coords: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number] },
  },
  openingTimes: [openingTimeSchema],
  reviews: [reviewSchema],
});

mongoose.model("Location", locationSchema);
