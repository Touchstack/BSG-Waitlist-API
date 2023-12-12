const status = require("http-status");
const has = require("has-keys");
const db = require("../models/database.js");
const schema = require("../models/users.js");

module.exports = {
  async newUser(req, res) {
    if (!has(req.body, ["email"]))
      throw { code: status.BAD_REQUEST, message: "You must specify the email" };

    let { email } = req.body;
    await schema.validateAsync({ email });
    await db
      .getDbo()
      .then((result) => {
        result.collection("join").createIndex({ email: 1 }, { unique: true });
        result.collection("join").insertOne({ email });
      })
      .catch((err) => {
        if (err) {
          if (err.code === 11000) {
            // Duplicate key error email is not unique
            return res.status(400).json({
              status: status.BAD_REQUEST,
              error: "Your email has already been added to the WaitList",
            });
          }
          return res.status(500).json({ error: "Internal server error" });
        }
      });
    res.status(200).json({ status: true, message: "joined" });
  },
};
