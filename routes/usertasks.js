var express = require('express')
var router = express.Router()


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
router.get('/', (req, res) => {
    if( req.session.auth == true){
        database.getDB().collection("tasks").find({}).toArray(function(err, result) {
        if (err) throw err;
        un=req.session.username;
        
        var dobj = { "tdata": result,"username":un ,"name":un,"obj":abt};
        res.render("alltasks", dobj);
    });
    }
    else{
        res.send("invalid user")
    }
})    
router.get('/addtask', (req, res) => {
if(req.session.username){
un=req.session.username;
var ob={"obj":{},"username":un};
res.render("task",ob)
}
else{
    res.redirect("/log/in")
}

})
module.exports=router;    