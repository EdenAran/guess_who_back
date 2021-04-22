const express = require('express')
const router = express.Router()
const { log } = require('../../middlewares/logger.middleware')
const { query, setGame, getById, update, remove } = require('./game.controller')

router.get('/', log, query)
router.get('/:id', log, getById)
router.post('/', log, setGame)
router.put('/', log, update)
router.delete('/:id', log, remove)

module.exports = router