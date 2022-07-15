require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const { MONGO_CLIENT_EVENTS } = require('mongodb');
const app = express();
const MongoClient = require('mongodb').MongoClient

const mongoConnect = process.env.MONGO_CONNECTION

MongoClient.connect(mongoConnect,{useUnifiedTopology: true})
    .then(client =>{
        console.log('Connected to db!')
        const db = client.db('Duck-Facts')
        const factsCollection = db.collection('facts')

        //allows express to render ejs files 
        app.set('view engine', 'ejs')

        //allows express to use bodyParser
        app.use(bodyParser.urlencoded({ extended: true }))

        //allow body-parser to handle JSON data
        app.use(bodyParser.json())

        //makes the public folder public
        app.use(express.static('public'))

        //listening at domina localhost:8000
        app.listen(8000, () => {
            console.log('Listening on localhost 8000')
        })

        //read request for website index 
        app.get('/', (req, res) =>{
            factsCollection.find().toArray()
                .then(results => {
                    res.render('index.ejs',{facts: results})
                })
                .catch(error => console.log(error))
        })

        //create a new duck fact
        app.post('/facts',(req, res) => {
            factsCollection.insertOne({fact: req.body.fact, author: req.body.author, likes: 0})
                .then(result =>{
                    res.redirect('/')
                })
                .catch(error => console.log(error))
        })

        //update existing facts 
        app.put('/facts', (req,res) => {
            console.log(req.body)
            factsCollection.findOneAndUpdate(
                {author: 'Zybrith'},
                {
                    $set: {
                        fact: req.body.fact,
                        author: req.body.author
                    }
                },
                {
                    upsert: true
                })
                    .then(result => {
                        res.json('Success')
                    })
                    .catch(error => console.log(error))
        })

        app.put('/like', (req,res) => {
            console.log(req.body)
            factsCollection.findOneAndUpdate(
                {
                    fact: req.body.fact,
                    author: req.body.author
                },
                {
                    $inc: {
                        likes:1
                    }
                },
                {
                    upsert: true
                })
                    .then(result => {
                        res.json('Success')
                    })
                    .catch(error => console.log(error))
        })

        app.delete('/facts', (req, res) => {
            factsCollection.deleteOne({ author: 'Faxing Facter'})
                .then(result => {
                    if(result.deletedCount == 0){
                        res.json('No fact to delete')
                    }
                    res.json("Deleted Faxing Facter's Faxed Fact")
                })
                .catch(err => console.log(err))
        })
    })
    .catch(error => console.log(error))


