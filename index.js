const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const port = 9000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tmhor.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
    const productsCollection = client.db('emaJohn').collection('emaJohnProducts');
    console.log('database connected');
    const ordersCollection = client.db('emaJohn').collection('orders');

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productsCollection.insertOne(product)
        .then((result) => {
            console.log(product);
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        });
    });

    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        });
    });
    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key }).toArray((err, documents) => {
            console.log(documents);
            res.send(documents[0]);
        });
    });
    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection
            .find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        console.log(order);
        ordersCollection.insertOne(order).then((result) => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        });
    });

    console.log('connected successfully ');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('connected');
});

app.listen(process.env.PORT || port);