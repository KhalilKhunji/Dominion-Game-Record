const mongoose = require("mongoose");

const validateKingdom = () => {
    if (array.length === 10) {
        return true;
    } else {
        return false;
    };
};

const validatePlayers = () => {
    if (array.length >= 2 && array.length <= 6) {
        return true;
    } else {
        return false;
    };
};

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    score: Number
});

const kingdomSchema = new mongoose.Schema({
    cards: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card'
            }],
        validate: [validateKingdom, 'Kingdoms need to be 10']
    }
});

const gameSchema = new mongoose.Schema({
    players: {
        type: [playerSchema],
        validate: [validatePlayers, 'Players need to be 2-6.']
    },
    enjoyability: {
        type: String,
        enum: ['1','2','3','4','5','6','7','8','9','10']
    },
    kingdom: [kingdomSchema],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;