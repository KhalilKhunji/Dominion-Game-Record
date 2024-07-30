const Game = require('../models/game.js');
const Card = require('../models/card.js');

let validationError = false;

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
    res.render('games/new.ejs', {kingdomCards, validationError});
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
        if (req.body[`kingdom-card-${i}`]) {
            kingdom.push({card: req.body[`kingdom-card-${i}`]});
        };
    };
    if (kingdom.length === 10 && uniqueChecker(kingdom, 'card') && players.length >= 2 && players.length <= 6) {
        validationError = false;
        const game = {
            players,
            enjoyability: req.body.enjoyability,
            kingdom,
            user_id: req.session.user._id
        };
        await Game.create(game);
        res.redirect('/games');
    } else {
        validationError = true;
        let playerNames = [];
        players.forEach((player) => {
            playerNames.push(player.name);
        });
        let playerScores = [];
        players.forEach((player) => {
            playerScores.push(player.score);
        });
        let kingdomIds = [];
        kingdom.forEach((object) => {
            kingdomIds.push(object.card);
        });
        const game = {
            playerNames,
            playerScores,
            enjoyability: req.body.enjoyability,
            kingdomIds,
            user_id: req.session.user._id
        };
        const kingdomCards = await Card.find({kingdom: true});
        res.render('games/new.ejs', {game, kingdomCards, validationError});
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
    res.render('games/edit.ejs', {game, kingdomCards, validationError});
};

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
    if (kingdom.length === 10 && uniqueChecker(kingdom, 'card') && players.length >= 2 && players.length <= 6) {
        validationError = false;
        const game = {
            players,
            enjoyability: req.body.enjoyability,
            kingdom,
            user_id: req.session.user._id
        };
        await Game.findByIdAndUpdate(req.params.gameId, game);
        res.redirect(`/games/${req.params.gameId}`);
    } else {
        validationError = true;
        res.redirect(`/games/${req.params.gameId}/edit`);
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