const express = require('express')
const mongoose = require('mongoose')
const CampGround = require('./models/campgrounds')
const path = require('path')
const methodOverride = require('method-override')
app = express()
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useUnifiedTopology: true, useNewUrlParser:true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function (){
    console.log('CONNECTION OPEN!!!')
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

// get all the campgrounds and show
app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await CampGround.find({})
    res.render("campgrounds/index", {campgrounds})
})

// create a new campground
app.post('/campgrounds', async (req,res)=>{
    const campground = new CampGround(req.body.campground)

    await campground.save()
    res.redirect(`/campground/${campground._id}`)
})

// access to the form to create new campground
app.get('/campground/new',(req, res)=>{
    res.render('campgrounds/new')
})

// get a campground by id and show
app.get('/campground/:id', async (req, res) =>{
    const campground = await CampGround.findById(req.params.id)
    res.render('campgrounds/show', {campground})
})

// show a form to edit a campground
app.get('/campgrounds/:id/edit', async (req, res)=>{
    const campground = await CampGround.findById(req.params.id)
    res.render('campgrounds/edit', {campground})
})

app.put('/campgrounds/:id', async (req, res)=>{
    const id = req.params.id
    await CampGround.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campground/${id}`)
})

app.listen(3000, ()=>{
    console.log("Server started")
})
