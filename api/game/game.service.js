const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;
const { allTiles } = require('./TilesDB')

async function query() {
    const collection = await dbService.getCollection('game');
    try {
        return await collection.find().toArray();
    } catch (err) {
        console.log('ERROR: cannot find games');
        throw err;
    }
}

async function getById(gameId) {
    const collection = await dbService.getCollection('game');
    try {
        const game = await collection.findOne({ '_id': ObjectId(gameId) });
        return game
    } catch (err) {
        console.log(`ERROR: while finding game ${gameId}`);
        throw err;
    }
}

async function remove(gameId) {
    const collection = await dbService.getCollection('game');
    try {
        await collection.deleteOne({ '_id': ObjectId(gameId) });
        return await collection.find().toArray();
    } catch (err) {
        console.log(`ERROR: cannot remove game ${gameId}`);
        throw err;
    }
}

async function add(player, numOfTiles) {
    const collection = await dbService.getCollection('game');
    const game = _getEmptyGame(player, numOfTiles);
    try {
        await collection.insertOne(game);
        return game;
    } catch (err) {
        console.log(`ERROR: cannot insert game`);
        throw err;
    }
}

async function update(game) {
    const collection = await dbService.getCollection('game');
    game._id = ObjectId(game._id);
    try {
        await collection.updateOne({ _id: game._id }, { $set: game });
        return await collection.find().toArray();
    } catch (err) {
        console.log(`ERROR: cannot update game ${game._id}`);
        throw err;
    }
}

module.exports = {
    query,
    getById,
    remove,
    add,
    update
};

// private functions

function _buildCriteria(filterBy) {
    var criteria = {};
    if (filterBy.id === 'guest') criteria.isPrivate = false;
    else {
        criteria = { $or: [{ "members._id": { $regex: filterBy.id } }, { "byMember._id": { $regex: filterBy.id } }, { "isPrivate": false }] }
    }
    return criteria;
}

function _getEmptyGame(player1, numOfTiles) {
    return {
        player1,
        player2: {},
        selectedTilesIdx: { 'player1': _getRandInt(numOfTiles), 'player2': _getRandInt(numOfTiles) },
        tiles: _getTiles(numOfTiles),
    }
}

function _getTiles(numOfTiles) {
    const tiles = _shuffle(allTiles).slice(0, numOfTiles)
    return tiles
}

function _shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function _getRandInt(range) {
    return Math.floor(Math.random() * range + 1)
}