import express from 'express'
const app = express()

const PORT = 3000

app.use(express.json())

app.listen(PORT,()=> {
    console.log(`Server srarted on port ${PORT}`)
})

app.get(`/`, (req, res)=> {
    res.status(212).send("<h1>Rassole!!<h1>")
})

app.get(`/shop`, (req, res)=> {
 res.status(232).send("<a href='/'> Welcome to de shop!</a>")
})

app.get(`/shop/:id`, (req, res)=> {
    const data = req.params
res.status(232).send(`<a href='/'> Welcome to de shop! ${data.id}</a>`)
})
