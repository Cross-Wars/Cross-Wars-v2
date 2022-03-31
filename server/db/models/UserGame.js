const Sequelize = require("sequelize")
const db = require("../db")

module.exports = db.define("userGame", {
  score: {
    type: Sequelize.INTEGER,
  },
})
