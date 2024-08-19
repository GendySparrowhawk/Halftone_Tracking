const express = require('express');
const exphbs = require("express-handlebars");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { GridFSBucket } = require('mongodb')
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const userRoutes = require('./controllers/userRoutes')

require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3333;

const connectDB = require("./config/connection");
connectDB();

const { authenticate, adminAuth } = require('./auth');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if(token === null) return res.sendStatus(401)

        jwt.verify(token, process.env.JWT_Secret, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user

            next();
        })
}

app.use(express.json());
    const hbs = exphbs.create({});
    app.engine("handlebars", hbs.engine);
    app.set("view engine", "handlebars");
    app.set("views", path.join(__dirname, "../views"));

    app.use(express.static(path.join(__dirname, "../public")));

    const db = mongoose.connection;
    let gfs;
    db.once("open", () => {
        gfs = new GridFSBucket(db.db, {
            bucketName: "uploads"
        });
        console.log('gfs init')
    });

    app.get("/", (req, res) => {
        res.render("home", {title: 'Halftone Tracking'});
    });
    
    app.use('/auth', userRoutes)

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
        console.log("grpahql ready to go @Halftone")
    });
