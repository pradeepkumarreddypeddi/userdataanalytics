var express = require('express')
var router = express.Router()
var timestamp = require('timestamp');
const multer =require('multer');
const multerS3 = require('multer-s3');
const aws= require('aws-sdk');
const jwt= require('jsonwebtoken');
var path = require('path');

var session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const database = require('./database');
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

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
  
  }
const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'userdataimages',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `image-${Date.now()}.jpeg`);
        }
    })
});

router.use(async (req, res, next) => {
    try {
        await database.connectDB(); 
    } catch (error) {
        console.log(error)
    }
    next()
})
router.get('/', async(req, res) => {
    if( req.session.auth == true){
        un=req.session.name;
     var abt=await database.getDB().collection("users").findOne({'name':req.session.name})
     var obj={"name":un,"username":un,"log":"login","obj":abt}
     res.render("about",obj);
     
    }

})  
router.post('/user',upload.single('photo'),async (req, res) => {
    if( req.session.auth == true){
          
     var udata={
         "photo":req.file.location,
     }
     un=req.session.name
    
    database.getDB().collection("users").updateOne({"name":un},{$set:udata}, function(err, response) {
        if (err) throw err;
        res.redirect("/homepage")
     })
    }

})    

module.exports = router;