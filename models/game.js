const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    score: Number
});

const kingdomSchema = new mongoose.Schema({
    card: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card'
    }
});

const gameSchema = new mongoose.Schema({
    players: [playerSchema],
    enjoyability: {
        type: String,
        enum: ['1','2','3','4','5','6','7','8','9','10']
    },
    kingdom: [kingdomSchema],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;