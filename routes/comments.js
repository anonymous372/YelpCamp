
var express    = require("express"),
    router     = express.Router({mergeParams:true}),

    Comment    = require("../models/comment"),
    Campground = require("../models/campground");

var middleware = require("../middleware")

// Enforced new comment route with middleware isLoggedIn
router.get("/new", middleware.isLoggedIn ,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err) console.log(err)
        else{
            res.render("comments/new",{campground: foundCampground})
        }
    })
})

// Enforced create comment route with middleware isLoggedIn
router.post("/", middleware.isLoggedIn ,function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong")
                    console.log(err)
                } else{
                    // Add username and id to the comment
                    comment.author.id = req.user.id
                    comment.author.username = req.user.username
                    comment.save()
                    
                    // Add the comment in the campground's comments array 
                    campground.comments.push(comment)
                    campground.save()

                    // Go Back to the Specific Campground 
                    req.flash("success","Successfully added comment")
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

// Edit form for comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err)
            res.redirect("back")
        else
            res.render("comments/edit",{campground_id: req.params.id, comment: foundComment})
    })
})

// Update the comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    updatedComment = req.body.comment
    Comment.findByIdAndUpdate(req.params.comment_id, updatedComment, function(err,updatedComment){
        if(err)
            res.redirect("/campgrounds")
        else
            res.redirect("/campgrounds/"+req.params.id)
   })
})

// Delete a comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(!err){
            console.log("Comment Deleted")
            req.flash("success","Comment deleted")
        }
        res.redirect("/campgrounds/"+ req.params.id)
    })
})

module.exports = router
