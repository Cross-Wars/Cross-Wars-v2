//this is the access point for all things database related!

const db = require("./db")

const User = require("./models/User")
const Crossword = require("./models/Crossword")
const Game = require("./models/Game")
const UserGame = require("./models/UserGame")

//associations could go here!

User.belongsToMany(Game, { through: UserGame })
Game.belongsToMany(User, { through: UserGame })

Crossword.hasMany(Game)
Game.belongsTo(Crossword)

module.exports = {
  db,
  models: {
    User,
    Crossword,
    Game,
    UserGame,
  },
}
