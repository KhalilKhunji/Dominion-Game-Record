const Game = require('../models/game.js');
const Card = require('../models/card.js');

const gameIndex = async (req, res) => {
    const games = await Game.find();
    res.render('games/index.ejs', {games});
};

const gameNew = async (req, res) => {
    const cards = await Card.find();
    res.render('games/new.ejs', {cards});
};

module.exports = {
    gameIndex,
    gameNew,

}