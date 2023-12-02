
const {
    DB_URL
} = process.env;



const {MongoClient} = require("mongodb");

let conn = new MongoClient(DB_URL, {useUnifiedTopology: true});

module.exports = {
    /**
     * Singleton-like Database Object that connects to the mongodb database
     */
    async getDbo() {
        try {
          await conn.connect();
          console.log("Connected successfully to server");
          return conn.db();
        } catch (err) {
          console.log("DB Conn Err: => ", err);
        }
      }
}
