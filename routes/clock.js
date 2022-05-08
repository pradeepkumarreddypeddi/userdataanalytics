var express = require('express')
var router = express.Router()
var timestamp = require('timestamp');

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
router.get('/cin', (req, res) => {
    if( req.session.auth == true){
     c=1;
     
     var cin=new Date(timestamp());
     var cdata={
         "clock in":cin
     }
     un=req.session.name
     var obj={"name":un,"username":un,"log":"login","ct":cin,"clock":"Clock in at:","obj":abt}
     database.getDB().collection("users").updateOne({"name":un},{$set:cdata}, function(err, response) {
     res.render("homepage",obj);
     })
    }

})  
router.get('/cout', (req, res) => {
    if( req.session.auth == true){
          
     var cout=new Date(timestamp());
     var cdata={
        "clock out":cout
    } 
     un=req.session.name
     database.getDB().collection("users").updateOne({"name":un},{$set:cdata}, function(err, response) {
     var obj={"name":un,"username":un,"log":"login","ct":cout,"clock":"Clock out at","obj":abt}
     res.render("homepage",obj);
     })
    }

})    

module.exports = router;