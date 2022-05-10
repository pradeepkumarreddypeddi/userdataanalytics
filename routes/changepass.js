var express = require('express')
var router = express.Router()
var timestamp = require('timestamp');
var session = require('express-session');
var alert= require('alert');
const { v4: uuidv4 } = require('uuid');
const database = require('./database');
var bcrypt = require('bcryptjs');
var mail = express.Router();
var nodemailer = require('nodemailer');
router.use(express.static('public'));
router.use(session({
    genid: function (req) {
        return uuidv4() // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3000000 },
    store: database.MongoStore.create({
        mongoUrl: database.url,
    }),
}))


router.use(async (req, res, next) => {
    try {
        await database.connectDB(); 
    } catch (error) {
        console.log(error)
    }
    next()
})
var abt;
router.use(async (req, res, next) => {
    try {
     abt=await database.getDB().collection("users").findOne({'name':req.session.name})
    } catch (error) {
        console.log(error)
    }
    next();
})



var gotp;

router.get('/', (req, res) => {
    if( req.session.auth == true){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'uiop2216@gmail.com',
              pass: '9908939412p'
            }
          });
          let otp = Math.floor(1000 + Math.random() * 9000);
          gotp=otp;
          var mailOptions = {
            from: 'uiop2216@gmail.com',
            to: abt.email,
            subject: 'Otp for changing password',
            text: 'OTP is: '+otp
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('OTP sent email: ');
              alert("otp sent to your mail")
              var obj={"name":un,"username":un,"log":"login","obj":abt}
              res.render("changepass",obj);
            }
          });
    
     
    }
    else{
        res.redirect('/login')
    }

}) 
 
router.post('/new', (req, res) => {
    if( req.session.auth == true){
        lotp=Number(req.body.otp)
    if(lotp==gotp){  
        console.log("correct")
 
    
    var hashpass = bcrypt.hash(req.body.pass, 10);
    hashpass.then((val) => {
     un=req.session.name
     database.getDB().collection("users").updateOne({"name":un},{$set:{password:val}}, function(err, response) {
     alert("successfully changed password")
     res.redirect("/homepage");
     })
    })
    }
    else{
        alert("wrong otp")
       // res.redirect('/cp')
    }
}


})    

module.exports = router;