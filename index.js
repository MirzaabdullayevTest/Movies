const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Movie = require('./model/movie')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function db() {
    await mongoose.connect('mongodb://localhost:27017/movie', (err) => {
        if (err) throw new Error(err)
        console.log('MongoDB connected');
    })
}

db()

// routes
// Add new movie 
app.post('/add', async (req, res) => {
    const movie = new Movie(req.body)
    await movie.save()
    res.status(201).send('Movie created')
})

// app.get('/movies/', async (req, res) => {
//     const movies = await Movie.find()
//     res.status(200).send(movies)
// })


app.get('/movies/', async (req, res) => {
    const page = req.query.page
    const count = req.query.count

    const movies = await Movie.find()
        .limit(count).skip((page - 1) * count).select({ _id: 0, __v: 0 })
    res.status(200).send(movies)
})

// Get all movies // filter
app.get('/movies/:startYear/', async (req, res) => {
    // console.log(req.params.startYear); 
    const movies = await Movie.find({ year: { $in: [2020, 1997] } }).sort({ imdb: -1 }).skip(0) // limit    
    res.status(200).send(movies)
})
// Update a movie
// Remove a movie

const port = 3000 || process.env.PORT
app.set('port', port)

try {
    app.listen(port, () => {
        console.log(`Server working on port ${app.get('port')}`);
    })
} catch (error) {
    console.log(error);
}