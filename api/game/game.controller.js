const gameService = require('./game.service')
const { error } = require('../../services/logger.service')

async function query(req, res) {
    try {
        const games = await gameService.query();
        res.send(games)
    }
    catch (err) {
        error(err)
    }
}

async function getById(req, res) {
    try {
        const game = await gameService.getById(req.params.id)
        res.send(game)
    }
    catch (err) {
        error(err)
    }
}

async function setGame(req, res) {
    const {user} = req.body
    const games = await gameService.add(user);
    res.send(games)
}

async function update(req, res){

    const games = await gameService.update(req.body.game)
    res.send(games)
}

async function remove(req, res){
    const games = await gameService.remove(req.params.id)
    res.send(games)
}


module.exports = {
    query,
    setGame,
    getById,
    update,
    remove
}

