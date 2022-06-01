var express = require('express');
var router = express.Router();
var alert= require('alert');
const jwt=require('jsonwebtoken');

//auth
router.use(function(req,res,next){
    jwt.verify(req.cookies.jwt, 'secretkey', (err, authData) => {
        if(err) {
          alert("please login")
          res.redirect("/log/out") 
        }
        else{
          next();
        }
      })
    })

module.exports = router;