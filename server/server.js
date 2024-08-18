const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require("@apollo/server/express4");
const exphbs = require("express-handlebars");
const path = require("path");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { GridFSBucket } = require('mongodb')

require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3333;
const is_prod = process.env.NODE_ENV === "production"
const connectDB = require("./config/connection");
const { typedefs, resolvers } = require("./schema");

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if(token === null) return res.sendStatus(401)

        jwt.verify(token, process.env.JWT_Secret, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user

            next();
        })
}

const server = new ApolloServer({
    typedefs,
    resolvers,
});

async function startServer() {
    await server.start();

    const hbs = exphbs.create({});
    app.engine("handlebars", hbs.engine);
    app.set("view engine", "handlebars");
    app.set("views", path.join(__dirname, "../views"));

    app.use(express.static(path.join(__dirname, "../public")));
    app.use(express.json());

    const db = mongoose.connection;
    let gfs;
    db.once("open", () => {
        gfs = new GridFSBucket(db.db, {
            bucketName: "uploads"
        });
        console.log('gfs init')
    });

    app.use("/grpahql", expressMiddleware(server));

    app.get("/", (req, res) => {
        res.render("home", {title: 'Home Page'});
    });

    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
        console.log("grpahql ready to go @Halftone")
    });

}

startServer();
