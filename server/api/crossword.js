const crosswordRouter = require('express').Router();
const { Op } = require('sequelize');
const {
  models: { Crossword },
} = require('../db');

//GET /api/crosswords
crosswordRouter.get('/', async (req, res, next) => {
  try {
    const crosswords = await Crossword.findAll();
    res.send(crosswords);
  } catch (err) {
    next(err);
  }
});

//GET /api/crosswords/:year
crosswordRouter.get('/:year', async (req, res, next) => {
  try {
    const crosswords = await Crossword.findAll({
      where: {
        date: {
          [Op.and]: {
            [Op.gte]: new Date(req.params.year, 0, 1),
            [Op.lte]: new Date(req.params.year, 11, 31),
          },
        },
      },
    });
    res.send(crosswords);
  } catch (err) {
    next(err);
  }
});

module.exports = crosswordRouter;
