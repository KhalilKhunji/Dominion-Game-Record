const Game = require('../models/game.js');
const Card = require('../models/card.js');

const uniqueChecker = (array, key) => {
    const uniques = new Set(array.map(item => item[key]));
    return [...uniques].length === array.length;
};

const gameIndex = async (req, res) => {
    const games = await Game.find({user_id: req.session.user});
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
    res.render('games/show.ejs', {game: currentGame});
};

const gameEdit = async (req, res) => {
    const currentGame = await Game.findById(req.params.gameId).populate('kingdom.card');
    let players = [];
    let scores = [];
    for (let i = 1; i <= 6; i++) {
        if (currentGame.players[i-1]) {
            players.push(currentGame.players[i-1].name);
            scores.push(currentGame.players[i-1].score);
        };
    };
    let kingdom = [];
    for (let i = 1; i <= 10; i++) {
        kingdom.push(currentGame.kingdom[i-1].card.name);
    };
    const game = {
        _id: currentGame._id,
        players,
        scores,
        enjoyability: currentGame.enjoyability,
        kingdom,
    };
    const kingdomCards = await Card.find({kingdom: true});
    res.render('games/edit.ejs', {game, kingdomCards});
};

// Need to move middleware and fix validation else
const gameUpdate = async (req, res) => {
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
                await Game.findByIdAndUpdate(req.params.gameId, game);
                res.redirect(`/games/${req.params.gameId}`);
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

const gameDelete = async (req, res) => {
    await Game.findByIdAndDelete(req.params.gameId);
    res.redirect("/games");
};

module.exports = {
    gameIndex,
    gameNew,
    gameCreate,
    gameShow,
    gameEdit,
    gameUpdate,
    gameDelete
};