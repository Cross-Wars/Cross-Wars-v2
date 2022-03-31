const Sequelize = require("sequelize")
const db = require("../db")

module.exports = db.define("game", {
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
})
