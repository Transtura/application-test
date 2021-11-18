/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file returns the database core configuration.
 * @param {null}
 * @name CorsConfig
 * @returns {Object}
 *
 */

module.exports = {
  default: "MongoDB",

  connections: {
    MySql: {
      driver: "mysql",
      url: process.env.DB_URL,
      charset: "utf8mb4",
      collation: "utf8mb4_unicode_ci",
      prefix_indexes: true,
      strict: true,
      engine: "innodb",
    },

    MongoDB: {
      driver: "mongodb",
      url: process.env.DB_URL,
      options: {
        family: 4,
        autoIndex: false,
        autoCreate: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        socketTimeoutMS: 30000,
        keepAlive: true,
      },
    },
  },
};
