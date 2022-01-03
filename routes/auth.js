
var express  = require("express"),
    router   = express.Router(),

    User     = require("../models/user"),
    passport = require("passport");

// Home page
router.get("/",function(req,res){
    res.render("home")
})


// Show Register form
router.get("/register",function(req,res){
    res.render("register",{page: "register"})
})

// Handle Sign Ups
// router.post("/register",function(req,res){
//     var newUser = new User({username:req.body.username})
//     User.register(newUser, req.body.password, function(err,user){
//         if(err){ 
//             console.log(err)
//             return res.render("error",{error: err.message})
//         }
//         passport.authenticate("local")(req,res,function(){
//             req.flash("success","Welcome to YelpCamp "+ user.username)
//             res.redirect("/campgrounds")
//         })
//     })
// })

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds"); 
        });
    });
});

// Show Login form
router.get("/login",function(req,res){
    res.render("login",{page: "login"})
})

// Handle Logins
router.post("/login",passport.authenticate("local",{
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req,res){
})


// Handle Logouts
router.get("/logout",function(req,res){
    req.logout()
    req.flash("success","Logged you out")
    res.redirect("/campgrounds")
})


// Middleware to check user is logged in or not
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next()
    else
        res.redirect("/login")
}

module.exports = router
