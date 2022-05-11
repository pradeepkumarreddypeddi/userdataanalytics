var MongoClient = require('mongodb').MongoClient;
const MongoStore = require('connect-mongo');
var ObjectId = require("mongodb").ObjectId;

var url = "mongodb+srv://pradeep:pradeep@cluster0.vykys.mongodb.net/userdata?retryWrites=true&w=majority";
let dbcon;

module.exports.connectDB= async ()=>{
    const db= await MongoClient.connect(url);
    console.log("atlas connected")
    dbcon=db.db('userdata')
}

module.exports.getDB=()=>{
    return dbcon;
}

module.exports.url=url;

exports.MongoStore=MongoStore;
exports.ObjectId=ObjectId;