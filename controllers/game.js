const Game = require('../models/game.js');
const Card = require('../models/card.js');

const uniqueChecker = (array, key) => {
    const uniques = new Set(array.map(item => item[key]));
    return [...uniques].length === array.length;
};

const gameIndex = async (req, res) => {
    const games = await Game.find();
    res.render('games/index.ejs', {games});
};

const gameNew = async (req, res) => {
    const kingdomCards = await Card.find({kingdom: true});
    res.render('games/new.ejs', {kingdomCards});
};

// Move validation to middleware
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
            if (req.body[`kingdom-card-${i}`]) {
                kingdom.push({card: req.body[`kingdom-card-${i}`]});
            };
        };
        if (kingdom.length === 10) {
            if(uniqueChecker(kingdom, 'card')) {
                const game = {
                    players,
                    enjoyability: req.body.enjoyability,
                    kingdom,
                    user_id: req.session.user._id
                };
                console.log(game);
                await Game.create(game);
                res.redirect('/games');
            } else {
                console.log('validation failed');
                res.locals.body = req.body;
                console.log(res.locals);
                // res.redirect('games/new');
            };
        } else {
            console.log('validation failed');
            console.log(res.locals);
        };
};

const gameShow = async (req, res) => {
    const currentGame = await Game.findById(req.params.gameId).populate('kingdom.card');
    console.log(currentGame.kingdom);
    res.render('games/show.ejs', {game: currentGame});
};

module.exports = {
    gameIndex,
    gameNew,
    gameCreate,
    gameShow,


}