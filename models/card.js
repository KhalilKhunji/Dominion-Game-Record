const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    name: String,
    expansion: String
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;