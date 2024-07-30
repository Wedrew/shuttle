import * as dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import RedisStore from "connect-redis"
import https from "https";
import http from "http";
import fs from "fs";

import { session_client } from "./db/session_client.js";
import { storage_client } from "./db/storage_client.js";
import { router as home_router } from "./routes/home.js";
import { router as contact_router } from "./routes/contact.js";
import { router as aboutus_router } from "./routes/about_us.js";
import { router as catalog_router } from "./routes/catalog.js";
import { router as gambling_router } from "./routes/gambling.js";
import { router as auth_router } from "./routes/auth.js";
import { router as lost_router } from "./routes/lost.js";

// Create application
const app = new express();
const redirect_app = new express();

// Redirect all traffic to https
redirect_app.get("*", function(req, res, next) {
    res.redirect("https://" + req.headers.host + req.path);
});

// Connect to session client
await session_client.connect().catch(console.error);

// Connect to storage client
await storage_client.connect().catch(console.error);

// Initialize store.
let redis_store = new RedisStore({ client: session_client });

// Set the view engine to ejs and folders
app.set('views', ['views', 'public/uploads']);
app.set('view engine', 'ejs');

app.use(session({
    secret: crypto.randomBytes(20).toString('hex'),
    store: redis_store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: false,
        maxAge: 1000 * 60 * 10,
        sameSite: true,
    }
}));

app.use(express.static("public", { dotfiles: 'allow' }));
app.use(function (req, res, next) {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
});

// Home page
app.use("/", home_router);

// Catelog page
app.use("/catalog", catalog_router);

// Gambling page
app.use("/gambling", gambling_router);

// Contact page
app.use("/contact", contact_router);

// About us
app.use("/about-us", aboutus_router);

// Authentication
app.use("/auth", auth_router);

// Lost page
app.use("/lost", lost_router);


// 404
app.use(async function (req, res, next) {
    res.render("pages/index", {
        page: '../partials/lost',
        css: "/css/default.css"
    });
});

if(process.env.NODE_ENV == "deploy") {
    const private_key = fs.readFileSync(process.env.PRIVATE_KEY, 'utf8');
    const certificate = fs.readFileSync(process.env.CERTIFICATE, 'utf8');
    const ca = fs.readFileSync(process.env.CA, 'utf8');
    const credentials = { key: private_key, cert: certificate, ca: ca };

    const https_server = https.createServer(credentials, app);
    const http_server = http.createServer(redirect_app);

    // Create HTTP server and forward to HTTPS
    http_server.listen(process.env.LISTEN_PORT, () => {
        console.log('Server listening on port %s', process.env.LISTEN_PORT);
    });

    // Create HTTPS server
    https_server.listen(process.env.SECURE_LISTEN_PORT, () => {
        console.log('Server listening on port %s', process.env.SECURE_LISTEN_PORT);
    });
} else if (process.env.NODE_ENV == "development") {
    const http_server = http.createServer(app);

    // Create HTTP server and forward to HTTPS
    http_server.listen(process.env.LISTEN_PORT, () => {
        console.log('Server listening on port %s', process.env.LISTEN_PORT);
    });
}
