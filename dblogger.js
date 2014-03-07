/**
 * Created by Mortoni on 06/03/14.
 */
var dbName = "pistorius";
var databaseURI = "localhost:27017/" + dbName;
var collection = ["messages"];
var db = require("mongojs").connect(databaseURI, collection);

module.exports = db;

