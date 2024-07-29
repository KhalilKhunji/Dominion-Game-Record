const Game = require('../models/game.js');
const Card = require('../models/card.js');

const gameIndex = async (req, res) => {
    const games = await Game.find();
    res.render('games/index.ejs', {games});
};

const gameNew = async (req, res) => {
    const kingdomCards = await Card.find({kingdom: true});
    res.render('games/new.ejs', {kingdomCards});
};

const gameCreate = async (req, res) => {
        let players = [];
        for (let i = 1; i <= 6; i++) {
            if (req.body[`player${i}name`]) {
                players.push({
                    name: req.body[`player${i}name`],
                    score: req.body[`player${i}score`]
                });
            };
        };
        let kingdom = [];
        for (let i = 1; i <= 10; i++) {
            kingdom.push({card: req.body[`kingdom-card-${i}`]});
        };
        const game = {
            players,
            enjoyability: req.body.enjoyability,
            kingdom,
            user_id: req.session.user._id
        };
        console.log(game);
        await Game.create(game);
        res.redirect('/games');
};

module.exports = {
    gameIndex,
    gameNew,
    gameCreate,

}