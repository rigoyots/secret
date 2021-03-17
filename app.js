//jshint esversion:6

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {
    secret: process.env.SECRET,
    encryptedFields: ["password"]
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {

    const newEmail = req.body.username;
    const newPassword = req.body.password;

    console.log(newEmail);
    console.log(newPassword);

    const newUser = new User({
        email: newEmail,
        password: newPassword
    });

    newUser.save(function (err) {
        if (!err) {
            res.render("secrets");
        };
    });

});

app.post("/login", function (req, res) {

    const email = req.body.username;
    const password = req.body.password;

    console.log(email);
    console.log(password);

    User.findOne({
        email: email
    }, function (err, foundUser) {
        if (!err) {
            if (foundUser) {
                if (foundUser.password === password) {
                    console.log("The user exists!");
                    res.render("secrets");
                } else {
                    console.log("Wrong password!");
                };
            } else {
                console.log("The user does not exist.");
            };
        };
    });

});




app.listen(3000, function () {
    console.log("Server started on port 3000.");
});