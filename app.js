const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

const companyData = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/EadvDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Create Schema
const postSchema = {
    Name: {
        type: String,
        required: 'Please enter your name',
        trim: true
    },
    Email: {type: String, required: true},
    Link:  {type: String, required: true},
    Desc:  {type: String, required: true},
}; 

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/posts", function (req, res) {
  Post.find({}, function(err, items) {
    res.render("posts", { image: "/images/AI.jpg", companyData: items});
  })
  
});

app.get("/pricing", function (req, res) {
  res.render("pricing");
});

app.get("/advertise", function (req, res) {
  res.render("advertise");
});


app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/posts/:company", function(req, res) {
  Post.find({}, function(err, items) {
    for (let index = 0; index < items.length; index++) {
    // console.log(req.params.company+ ", " + companyData[index]["companyName"]);
    if (_.lowerCase(req.params.company) === _.lowerCase(items[index].Name)) {
      res.render("companyPage.ejs", {title: items[index].Name, context: items[index].Desc})
    }
  }
  })
  
});

app.post("/advertise", function(req, res) {
  // console.log(req.body.companyName);
  // console.log(req.body.companyEmail);
  // console.log(req.body.companyLink);
  // console.log(req.body.companyDesc);

  const post = new Post({
    Name  : req.body.companyName,
    Email : req.body.companyEmail,
    Link  : req.body.companyLink,
    Desc  : req.body.companyDesc
  });

  post.save();



  companyData.push(post);

  // console.log(companyData)

  res.redirect("/advertise");
});



app.listen(3000, function () {
  console.log("Server started on port 3000");
});
