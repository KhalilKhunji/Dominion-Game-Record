const Game = require('../models/game.js');

const index = async (req, res) => {
    const games = await Game.find();
    res.render('./games/index.ejs', {games});
};

module.exports = {
    index,

}