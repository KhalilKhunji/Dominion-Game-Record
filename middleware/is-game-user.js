const Game = require('../models/game.js');

const isGameUser = async (req, res, next) => {
    const game = await Game.findById(req.params.gameId);
    const gameUser = game.user_id.toString();
    if(req.session.user._id === gameUser) {
        next();
    } else {
        res.redirect('/games');
    };
};

module.exports = isGameUser;