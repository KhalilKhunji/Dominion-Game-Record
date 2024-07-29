const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    name: String,
    expansion: String,
    Kingdom: Boolean
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;