const status = require("http-status");
const has = require("has-keys");
const db = require("../models/database.js");
const schema = require("../models/users.js");
const nodeMailer = require("nodemailer");

async function emailHandler(email) {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    ssl: true,
    auth: {
      user: "abdulillah690@gmail.com",
      pass: "dsvuhznybokxnkuz",
    },
  });

  const info = await transporter.sendMail({
    from: "BSG_WAITLIST <no-reply@Bsg_waitlist.com>",
    to: `${email}`,
    subject: "BSG-WAITLIST (Request)",
    html: `<!DOCTYPE html>
    <html lang="en">
     
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto Sans:wght@400&display=swap">
    </head>
     
    <body>
    <div style="margin: 0; font-family: 'Poppins', sans-serif; line-height: normal;" class="container">
    <div style="position: relative; border-radius: 10px; border: 2px solid #d3d5d6; box-sizing: border-box; width: 90%; max-width: 600px; margin: 80px auto; background-color: #fff; padding: 40px 20px 0; display: flex; flex-direction: column; align-items: center; gap: 19px;" class="content">
    <div style="display: flex; align-items: center; justify-content: center;" class="logo-container">
    <img style="width: 100%; max-width: 205.5px; height: auto;" class="logo" alt="" src="https://svgshare.com/i/10fM.svg">
    </div>
    <div style="position: relative; border-radius: 20px; background-color: #8f98ff; overflow: hidden; margin-top: 20px;" class="image-container">
    <img style="width: 100%; height: auto; object-fit: cover;" class="image" alt="" src="https://i.ibb.co/kyw4Bz7/image-1-2x.png">
    </div>
    <div style="width: 100%;" class="text-container">
    <p style="margin: 0 0 15px;">A warm welcome to The Best Study Guide 🌟 We're happy to have you on board as we embark on a journey to make your bar exam preparation a breeze. Our platform is more than just a study resource—it's your cozy corner for effective and stress-free learning.</p>
    <p style="margin: 0 0 15px;"><b>Here's what you can expect:</b></p>
    <ul style="margin: 0; padding-left: 20px;">
    <li><span>Exclusive sneak peeks into our product development.</span></li>
    <li><span>Priority access to early releases and special promotions.</span></li>
    <li><span>Regular updates to keep you in the loop.</span></li>
    </ul>
    <p style="margin-top: 50px;">We value your trust and are committed to delivering a product that exceeds your expectations. If you have any questions, suggestions, or just want to say hello, feel free to reply to this email.</p>
    <p>Thank you again for joining us on this exciting journey. We can't wait to share more with you soon!</p>
    </div>
     
          <div style="width: 100%; text-align: center; font-size: 13px; font-family: 'Noto Sans', sans-serif;" class="footer">
    <hr style="margin-bottom: 30px; ">
    <div>You are receiving this email because you joined our waitlist</div>
    <!-- Add your social media icons or links here -->
    <div>
    <img alt="" src="https://svgshare.com/i/10fN.svg">
    </div>
    </div>
    </div>
    </div>
    </body>
     
    </html>`,
  });

  console.log("Message sent" + info.messageId);
}

module.exports = {
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
          .insertOne({ email })
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
        await emailHandler(email).catch((err) =>
          res.json({ status: false, message: err })
        );
      })
      .catch((err) => {
        console.log("ERR BOTTOM: ==>", err);
        return res.status(500).json({ error: "Internal server error" });
      });
  },
};
