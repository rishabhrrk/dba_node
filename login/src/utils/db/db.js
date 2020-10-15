require('dotenv').config()
const logger = require('../logger')
const redis = require("redis");

class Database{
  constructor(){
    this.client = redis.createClient();
  }
  async connect(){
    this.client.on('error', (err) => {
      logger.error(err.stack)
    })
    this.client.on('connect', () => {
      logger.info("You are now connected to Redis");
    });
  }
}

module.exports = new Database()