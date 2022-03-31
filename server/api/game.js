const gameRouter = require("express").Router()

const {
  models: { Game, Crossword, User, UserGame },
} = require("../db")

const requireToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const user = await User.findByToken(token)
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

gameRouter.get("/", async (req, res, next) => {
  try {
    const game = await Game.findAll()

    res.send(game)
  } catch (err) {
    next(err)
  }
})

gameRouter.post("/:crosswordId", async (req, res, next) => {
  try {
    const id = req.params.crosswordId

    const game = await Game.create({ crosswordId: id })

    res.send(game)
  } catch (err) {
    next(err)
  }
})

gameRouter.put("/:gameId", requireToken, async (req, res, next) => {
  try {
    const score = req.body.score
    const game = await Game.findByPk(req.params.gameId)
    //await game.update({ completed: true })

    //await game.update({ userId: req.user.id })
    await game.addUser(req.user)

    const userGame = await UserGame.findOne({
      where: {
        userId: req.user.id,
        gameId: req.params.gameId,
      },
    })

    await userGame.update({ score: score })

    res.send(userGame)
  } catch (err) {
    next(err)
  }
})

// gameRouter.get("/userprofile", requireToken, async (req, res, next) => {
//   try {
//     // const usergame = await Game.findAll({
//     //   include: {
//     //     model: User,

//     //     where: {
//     //       id: req.user.id,
//     //     },
//     //     attributes: ["id", "username"],
//     //   },
//     // })

//     const usergame = await UserGame.findAll({
//       where: {
//         userId: req.user.id,
//       },
//     })

//     res.send(usergame)
//   } catch (err) {
//     next(err)
//   }
// })

gameRouter.get("/userprofile", requireToken, async (req, res, next) => {
  try {
    const game = await Game.findAll({
      include: [
        {
          model: User,
          where: {
            id: req.user.id,
          },
          attributes: ["id", "username"],
        },
        {
          model: Crossword,
        },
      ],
    })

    res.send(game)
  } catch (err) {
    next(err)
  }
})

module.exports = gameRouter
