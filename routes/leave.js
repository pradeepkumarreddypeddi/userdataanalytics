var express = require('express')
var router = express.Router()
var timestamp = require('timestamp');
var nodemailer= require('nodemailer');
var alert= require('alert');
var session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const database = require('./database');
var jwtauth = require('./jwtauth')

var c="";
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



var abt;
router.use(async (req, res, next) => {
    try {
     abt=await database.getDB().collection("users").findOne({'name':req.session.name})
    } catch (error) {
        console.log(error)
    }
    next();
})
//router.use(jwtauth)

router.get('/', (req, res) => {
    if(req.session.name){
    un=req.session.name;
    var ob={"obj":abt,"username":un,"name":un};
    res.render("leave",ob)
    }
    else{
        res.redirect("/login")
    }

})

router.post('/apply', (req, res) => {
    var udata={
        "uid":req.body.uid,
        "reason":req.body.reason,
        "fdate":req.body.fdate,
        "tdate":req.body.tdate,
        "type":req.body.type
    }
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'uiop2216@gmail.com',
          pass: '9908939412p'
        },
        tls: {
            rejectUnauthorized: false
        }
      });
      
      var mailOptions = {
        from: 'uiop2216@gmail.com',
        to: 'pradeepkumarreddypeddi739@gmail.com',
        subject: 'Leave application',
        text:'Type: '+udata.type+"       from: "+udata.fdate+"       to: "+udata.tdate+'              Reason: '+udata.reason
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent successfully');
          alert("your leave sent to your manager successfully");
          database.getDB().collection('leave').insertOne(udata, (err, res1) => {
            res.redirect('/homepage')
          })
        }
      });

    }); 

module.exports=router;    