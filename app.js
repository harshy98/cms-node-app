var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var seedDB = require("./seeds.js");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//mongoose.connect("mongodb://localhost:27017/yelp_camp");
mongoose.connect("mongodb://noder:harsh1998@ds239412.mlab.com:39412/nodeweb");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB();

app.use(require("express-session")({
    secret: "This is unlocked",
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

app.get("/", function(req, res) {
    res.render("landing");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp started");
});