const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vncfx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000


app.get('/', (req,res) =>{
    res.send("Working successfully");
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("ema-jhon").collection("products");
    const ordersCollection = client.db("ema-jhon").collection("products");
    // perform actions on the collection object
    app.post('/addProduct', (req, res) => {
        const products = req.body
        productsCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount)
            })
    })

    app.get('/products', (req, res) => {
        const search = req.query.search;
        productsCollection.find({name: {$regex: search}})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/products/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: { $in: productKeys} })
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })


});


app.listen(process.env.PORT || port);



//Api Link: https://enigmatic-shelf-22607.herokuapp.com/products