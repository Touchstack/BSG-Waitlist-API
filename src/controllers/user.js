const status = require("http-status");
const has = require("has-keys");
const db = require("../models/database.js");
const schema = require("../models/users.js");

module.exports = {
  async getUsers(req, res) {
    await db
      .getDbo()
      .then(async (result) => {
        await result
          .collection("join")
          .find({})
          .toArray()
          .then((response) => {
            return res.status(200).json({ status: true, data: response });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ error: "Failed to Fetch Data from Database" });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: "Internal server error" });
      });
  },
  async newUser(req, res) {
    if (!has(req.body, ["email"]))
      throw { code: status.BAD_REQUEST, message: "You must specify the email" };

    let { email } = req.body;
    await schema.validateAsync({ email });
    await db
      .getDbo()
      .then(async (result) => {
        await result
          .collection("join")
          .createIndex({ email: 1 }, { unique: true });
        await result
          .collection("join")
          .insertOne({ email, timestamp: new Date().toISOString() })
          .then(() => {
            return res.status(200).json({ status: true, message: "joined" });
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
              console.log("ERR: ==>", err);
              return res.status(500).json({ error: "Internal server error" });
            }
          });
      })
      .catch((err) => {
        console.log("ERR BOTTOM: ==>", err);
        return res.status(500).json({ error: "Internal server error" });
      });
  },
};
