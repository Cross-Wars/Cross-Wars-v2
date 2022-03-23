const Sequelize = require("sequelize")
const db = require("../db")

module.exports = db.define("crossword", {
  name: {
    type: Sequelize.STRING,
  },
  date: {
    type: Sequelize.DATEONLY,
  },
  difficulty: {
    type: Sequelize.ENUM("easy", "medium", "hard"),
    defaultValue: "easy",
  },
  author: {
    type: Sequelize.STRING,
  },
  data: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
})
