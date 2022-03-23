const Sequelize = require("sequelize")
const pkg = require("../../package.json")

const databaseName = pkg.name + (process.env.NODE_ENV === "test" ? "-test" : "")

const config = {
  logging: false,
}

if (process.env.LOGGING === "true") {
  delete config.logging
}

console.log(process.env.DATABASE_URL)
//https://stackoverflow.com/questions/61254851/heroku-postgres-sequelize-no-pg-hba-conf-entry-for-host
if (process.env.DATABASE_URL) {
  config.dialectOptions = {
    ssl: {
      rejectUnauthorized: false,
    },
  }
}
console.log(process.env.DATABASE_URL)

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  config
)
module.exports = db
