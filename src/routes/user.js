const express = require('express');
const router = express.Router();


const user = require('@controllers/user.js');




router.post('/api/users', user.newUser);



module.exports = router;