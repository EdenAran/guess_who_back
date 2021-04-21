const express = require('express')
const { log } = require('../../middlewares/logger.middleware')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const { query, setGame, getById, update, remove } = require('./game.controller')
const router = express.Router()

router.get('/', log, query)
router.get('/:id', log, getById)
router.post('/', log, setGame)
router.put('/', log, update)
router.delete('/:id', log, remove)

module.exports = router