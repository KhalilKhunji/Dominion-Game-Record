const Game = require('../models/game.js');

const gameIndex = async (req, res) => {
    const games = await Game.find();
    res.render('games/index.ejs', {games});
};

const gameNew = (req, res) => {
    res.render('games/new.ejs');
};

module.exports = {
    gameIndex,
    gameNew,

}