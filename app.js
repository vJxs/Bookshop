import express from 'express'
import {PORT,MongoDBURL} from './config.js'
import{ MongoClient, ServerApiVersion } from "mongodb" ;

const app = express()

app.use(express.json())

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MongoDBURL,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const booksDB = client.db("myBookShop")
const myBooks = booksDB.collection("booksCollection")
app.listen(PORT,()=> {
    console.log(`Server srarted on port ${PORT}`)
})

app.get('/', (req, res)=> {
   return res.status(200).send("<h1>Rassole!!<h1>")
})

app.get('/shop', (req, res)=> {
   return res.status(200).send("<a href='/'> Welcome to de shop!</a>")
})

app.get('/shop/:id', (req, res)=> {
    const data = req.params
  return res.status(200).send('<a href='/'> Welcome to de shop! ${data.id}</a>')
})

app.post('/savebook',(req, res)=>{
    const data = req.body
    if(!data.title)
    return res.status(400).send("No title found ye idiot.")

    if(!data.author)
    return res.status(400).send("No author here dummy.")

    if(!data.price)
    return res.status(400).send("No price here, check somewhere else")

    myBooks.insertOne(data, (error, response)=>{
        if(error){
            console.log("An error occurred!)")
            return res.sendStatus(500)
        }

    })
    return res.status(201).send(JSON.stringify (data))
})