const status = require('http-status');
const has = require('has-keys');
const db = require('../models/database.js');
const schema = require('../models/users.js');
  



module.exports = {
    async newUser(req, res){
        if(!has(req.body, ['email']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the email'};

        let { email } = req.body;
        await schema.validateAsync({email});
        await db.getDbo().then((result)=>{
            result.collection('join').insertOne({email})
           });
            res.status(200).json({status: true, message: 'joined'});
    }
}
