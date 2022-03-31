const router = require("express").Router()
module.exports = router
const crosswordRouter = require("./crossword")
const gameRouter = require("./game")

router.use("/crosswords", crosswordRouter)
router.use("/game", gameRouter)
router.use("/users", require("./users"))

router.use((req, res, next) => {
  const error = new Error("Not Found")
  error.status = 404
  next(error)
})
