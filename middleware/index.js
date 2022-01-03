var Campground = require("../models/campground")
var Comment = require("../models/comment")

// All the middlewares
var middlewareObj = {}

// Middleware to check user is logged in or not
middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error","You need to be Logged In first")
    res.redirect("/login")
}

// Middleware to check weather campground belong to current user
middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        campgroundId = req.params.id
        Campground.findById(campgroundId,function(err,foundCampground){
            if(err){
                req.flash("error","Campground not found")
                res.redirect("back")
            }
            else{
                if(foundCampground.author.id.equals(req.user.id))
                    next();
                else{
                    req.flash("error","You don't have permission to do that")
                    res.redirect("back")    
                }
            }
        })
    }
    else{
        req.flash("error","You need to be Logged In to do that")
        res.redirect("back")
    }
}

// Middleware to check weather campground belong to current user   
middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err)
                res.redirect("back")
            else{
                if(foundComment.author.id.equals(req.user.id))
                    next()
                else{
                    req.flash("error","You don't have permission to do that")
                    res.redirect("back")
                }    
            }
        })
    }
    else{
        req.flash("error","You need to be Logged In to do that")
        res.redirect("/login")
    } 
}

module.exports = middlewareObj