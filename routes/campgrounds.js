var express = require("express"),
    router = express.Router({mergeParams:true}),
    Campground = require("../models/campground");

var middleware = require("../middleware")

// INDEX - Show all Campgrounds
router.get("/",function(req,res){
    // Get all the campgrounds from DB
    Campground.find({},function(err,allCampgrounds){
        if(err) console.log(err)
        else{
            res.render("campgrounds/index",{campgrounds: allCampgrounds, currentUser: req.user, page: "campgrounds"})
        }
    })
})

// CREATE - Adds a new campround to DB
router.post("/", middleware.isLoggedIn,function(req,res){
    // Push the new campground into the DB & render
    var name = req.body.campground.name
    var author = {
        id: req.user.id,
        username: req.user.username
    }
    newCampground = req.body.campground
    newCampground.author = author 
    Campground.create(newCampground,
        (err,campground)=>{
            if(err) console.log(err)
            else{
                console.log("Camp Added! : " + campground.name)
                res.redirect("/campgrounds")
            }
    })   
})
// NEW - Show form to create new campground  
router.get("/new", middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new")
})

// SHOW - Shows more info about one campgrounds 
router.get("/:id",function(req,res){
    // Find data of campground using its id in url
    campgroundId = req.params.id 
    Campground.findById(campgroundId).populate("comments").exec(function(err,foundCampground){
        if(err) console.log(err)
        else{
            res.render("campgrounds/show",{campground: foundCampground})
        }
    }) 
})

// EDIT - Show edit campground form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    // Find data of campground using its id in url
    campgroundId = req.params.id
    Campground.findById(campgroundId,function(err,foundCampground){
        if(err)
            res.redirect("/campgrounds")
        else
            res.render("campgrounds/edit",{campground: foundCampground})
    })
})
// UPDATE - Update the changes in DB
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    updatedCampground = req.body.campground
    Campground.findByIdAndUpdate(req.params.id,updatedCampground,function(err,campground){
        if(err){
            res.redirect("/campgrounds")
        }
        else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// Destroy - Remove a Campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(!err){
            console.log("Removed Campground !!!")
            req.flash("success","Campground deleted")
        }
        res.redirect("/campgrounds")

    })
})

module.exports = router
