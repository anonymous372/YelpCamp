var express        = require('express'),   
    mongoose       = require('mongoose'),
    bodyParser     = require('body-parser'),
    flash          = require('connect-flash'),
    methodOverride = require('method-override'),
    app            = express(),
    seedDB         = require('./seeds');

//Import Routes 
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    authRoutes       = require("./routes/auth");

// Authorization Packages
var passport       = require('passport'),
    localStrategy  = require('passport-local')

// Import the Schemas
var Campground  = require('./models/campground')
var Comment     = require('./models/comment')
var User        = require('./models/user');

const url = process.env.MONGODB_URL || "mongodb://localhost:27017/yelp_camp_v12"

// Configurations
mongoose.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });


app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine","ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())
// seedDB() // Seeding the DB 

// Passport Configuration
app.use(require("express-session")({
    secret: "I am anonymous377",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Magical middleware : passes req.user to every route
app.use(function(req,res,next){
    // currentUser can be used anywhere to get req.user
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})  

// Using Routes
app.use("/",authRoutes)
app.use("/campgrounds",campgroundRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT,function(req,res){
    console.log("Listening on http://localhost:"+PORT)
})
