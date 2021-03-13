
const express = require('express');
var router = express.Router();
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
const { Router } = require('express');
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));


app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://hoaan:123456abc@cluster0.jfaxd.mongodb.net/MyStore';

app.get('/all',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("MyStore");
    let results = await dbo.collection("MyStore").find({}).toArray();
    res.render('index',{products:results});
})

app.get('/delete',async function(req,res){
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("MyStore");

    await dbo.collection("MyStore").deleteOne(condition);
    res.redirect('/all');
})

app.get('/insert',async function(req,res){
    res.render('insert');
})

app.post('/doInsert',async function (req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("MyStore");
    let Name = req.body.txtName;
    let Price = req.body.txtPrice;
    let Description = req.body.txtDescription;
    let newProduct = {name : Name, price : Price, description: Description};
    await dbo.collection("MyStore").insertOne(newProduct);
    console.log(newProduct);
    
    res.redirect('/all');
});

var PORT = process.env.PORT || 5000
app.listen(PORT);
console.log("Server is running at " + PORT)