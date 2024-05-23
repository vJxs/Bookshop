import express from 'express'
import cors from 'cors'
import {PORT,MongoDBURL} from './config.js'
import{ MongoClient, ObjectId, ServerApiVersion } from "mongodb" ;
const app = express()

app.use(cors())
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
    //route show all books
   return res.status(200).send("<h1>Rassole!!<h1>")
})

app.get('/shop', (req, res)=> {

   myBooks.find().toArray()
   .then(response=>{
       return res.status(200).send(response)
   })
   //return res.status(200).send('<a href='/'> Welcome to de shop! ${data.id}</a>')
   .catch(err=>console.log(err))
})

app.get('/shop/:id', (req, res)=> {
    //route show a specific book
    const data = req.params

    const filter = {
        "_id" : new ObjectId(data.id)
    }
    
    myBooks.findOne(filter)
    .then(response=>{
        return res.status(200).send(response)
    })
  //return res.status(200).send('<a href='/'> Welcome to de shop! ${data.id}</a>')
  .catch(err=>console.log(err))
})

app.post('/admin/savebook', (req, res)=>{
    // Route adds a new book
    const data = req.body
    if(!data.title)
    return res.status(400).send({message:"No title found ye idiot."})

    if(!data.author)
    return res.status(400).send({message:"No author here dummy."})

    if(!data.price)
    return res.status(400).send({message:"No price here, check somewhere else"})

    myBooks.insertOne(data)
       .then(response=>{
        return res.status(201).send(JSON.stringify(response))
       })
       .catch(err=>console.log(err))
})

//  Added from my pc 

app.delete('/admin/remove/:id', (req,res)=>{
    const data = req.params
    const filter = {
        "_id" : new ObjectId(data.id)
    }
    
    myBooks.deleteOne(filter)
    .then(response=>{
        if(response.deletedCount)
            return res.status(200).send({ message: "Book Deleted Successfully"})
        else
            return res.status(500).send({ message: "Oops! Something wen't wrong."})
    })
  //return res.status(200).send('<a href='/'> Welcome to de shop! ${data.id}</a>')
  .catch(err=>console.log(err))   
})

app.put('/admin/update/:id', (req,res)=>{
    const data = req.params
    const docData = req.body
    
    const filter = {
        "_id" : new ObjectId(data.id)
    }
    //Removes_id key
    delete docData._id
    
    const updDoc = {
        $set: {
           ...docData //docData.price, docData.cover
        }
    }

    myBooks.updateOne(filter, updDoc)
   .then(response=>{
        let msg = {}
            if (!response.matchedCount || !response.modifiedCount)
                msg = { message: "Oops! Something went wrong!."}
            else
                msg = { message: "Update successful."}
            
            res.status(200).send(msg)
    
    })
    .catch(err=>console.log(err)) 
})