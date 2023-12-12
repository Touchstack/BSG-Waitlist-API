const status = require('http-status');
const has = require('has-keys');
const db = require('../models/database.js');
const schema = require('../models/users.js');
const nodeMailer = require('nodemailer');
  

async function emailHandler(email){
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        ssl: true,
        auth:{
            user: 'abdulillah690@gmail.com',
            pass: 'dsvuhznybokxnkuz'
        }
    });

    const info = await transporter.sendMail({
        from: 'BSG_WAITLIST <no-reply@Bsg_waitlist.com>',
        to: `${email}`,
        subject: 'BSG-WAITLIST (Request)',
        html:`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
            />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Noto Sans:wght@400&display=swap"
            />
        
            <style>
              body {
                margin: 50px;
                line-height: normal;
              }
              
              :root {
                /* fonts */
                --font-noto-sans: "Noto Sans";
                --font-poppins: Poppins;
              
                /* Colors */
                --color-black: #000;
              
                /* Paddings */
                --padding-11xl: 30px;
              }
          
              .main{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
        
              .main-container{
                display: flex;
                align-items: center;
                justify-content: center;
              }
        
              .hero-img{
                width: 500px;
                height: 302px;
                border-radius: 50px;
              
              }
        
              .logo{
                margin-bottom: 50px;
              }
        
              .container{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
        
              .hero-text{
                width: 360px;
              }
        
              .hero-container{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
            </style>
        
          </head>
          <body>
            <div class="main-container">
              <div class="main">
                  <img class="logo" alt="" src="https://svgshare.com/i/10fM.svg" />
               
                <div class="container">
                  <div class="img-container">
                    <img class="hero-img" alt="" src="https://s3-alpha-sig.figma.com/img/5eda/4e08/474e3745b14c8f6fe11e7bef36bec808?Expires=1703462400&Signature=cEz9tdfcQcwGvli9IRQ8-X2-Jo3VCuyOkl4Q8cs7mpAloYGqapsjSHjow9l5S39Ren5GGTS5XN-hCrXnX8Xky86AHvPGvwuvwjOu2XXp3TYswf4W-6nzwTpxxGO3qJQ94xWCzDoQP2x2NX1~O40udrgvw0JDiafrB2PGTMQThjP-51O8st8Ehx0Gpnrsn-lakqh3o1f4JpZJOrP3fiV6knmcPXwBAVdZb6duVmQ9Wq-4bmMuKsNh4tpbskJpPU3kc4wsyTrox1L42qN~A0e2AA~VI6M9zkcRE~jdPGQpGafkfe2vXRY5cV-~gce5rdUYsVlbFRZp8IQA89Y4XUCRmA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4" />
                  </div>
                  <div >
                     
                    <!--hero writting section-->
                      <div style="display: flex; justify-content: center; align-items: center;">
                        <p style="width: 400px; flex: auto;">
                          A warm welcome to The Best Study Guide 🌟
                          We're happy to have you on board as we embark on a journey to make
                          your bar exam preparation a breeze. Our platform is more than just
                          a study resource—it's your cozy corner for effective and
                          stress-free learning.
                        </p>
                      </div>
                     <!--hero writting section-->
        
                   <!--here is what to know section-->
                       <div>
                         <p>
                          <b>Here's what you can expect:</b>
                         </p>
                         <ul style="width: 300px;">
                           <li>Exclusive sneak peeks into our product development.</li>
                           <li>Priority access to early releases and special
                            promotions.</li>
                           <li>Regular updates to keep you in the loop.</li>
                         </ul>
                       </div>
                   <!--here is what to know section-->
        
                    <!--We value you section-->
                    <div style="display: flex; justify-content: center; align-items: center;">
                        <p>
                            We value your trust and are committed to delivering a product that
                            exceeds your expectations. If you have any questions, suggestions,
                            or just want to say hello, feel free to reply to this email.
                        </p>
                        </div>
                    <!--We value you section-->
        
                     <!--Thank you section-->
                          <div style="display: flex; justify-content: center; align-items: center;">
                             <p>
                              Thank you again for joining us on this exciting journey. We can't
                              wait to share more with you soon!
                             </p>
                          </div>
                     <!--Thank you section-->
        
                    <hr />
                    <div style="margin-top: 30px; font-size: 13px; display: flex; justify-content: center; align-items: center;">
                      <p> You are receiving this email because you joined our waitlist</p>
                    </div>
                   
                  <div style="display: flex; justify-content: center; ">
                    <img class="logo" alt="" src="https://svgshare.com/i/10fN.svg" />
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
        `,
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
            await emailHandler(email)
            .catch(err => res.json({status: false, message: err}))
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
                return res.status(500).json({ error: "Internal server error" });
              }
            });
        })
        .catch(() => {
          return res.status(500).json({ error: "Internal server error" });
        });
    },
  };
