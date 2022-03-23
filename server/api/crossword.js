const crosswordRouter = require("express").Router()
const {
  models: { Crossword },
} = require("../db")

crosswordRouter.get("/", async (req, res, next) => {
  try {
    const crosswords = await Crossword.findAll()
    console.log(crosswords)
    res.send(crosswords)
  } catch (err) {
    next(err)
  }
})

module.exports = crosswordRouter
