import { Router } from 'express'
import multer from 'multer';
import { session_client } from '../db/session_client.js';
import { storage_client } from '../db/storage_client.js';
import { is_admin } from "../routes/auth.js";
import crypto from 'crypto';
import path from "path";

export const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, path.basename(file.originalname, path.extname(file.originalname)) + "-" + Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

const form_parser = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }
});

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Article page
router.get('/entry/:id', async function (req, res) {
    let id = req.params.id;
    let redis_article;
    let exists = false;
    // Loop through articles and find article_html_file
    const result = await storage_client.lRange("articles", 0, -1);
    result.forEach(function (v) {
        let article = JSON.parse(v);
        if (article.id == id) {
            redis_article = article;
            exists = true;
        }
    });

    // If it does exist, get the field
    if (exists) {
        res.render("pages/index", {
            page: '../partials/article',
            css: "/css/article.css",
            article: redis_article
        });
    } else {
        // Send failure notification
        res.redirect("lost");
    }
});

// Article new page get
router.get('/new', async function (req, res) {
    // If logged in, display login info, else display login page
    let page = '../partials/unauthorized';
    if (req.session.loggedin) {
        let key = "admins";
        const admin_status = await is_admin(key, req.session.username);

        // If admin allow access
        if (admin_status) {
            page = '../partials/new_article';
        }
    }

    res.render("pages/index", {
        page: page,
        css: "/css/default.css"
    });
});

// Article new page post
router.post("/new", form_parser.fields([
    { name: 'article-image', maxCount: 1 },
    { name: 'article-html', maxCount: 1 }
]), async (req, res) => {
    // If logged in, display login info, else display login page
    if (req.session.loggedin) {
        let key = "admins";
        const admin_status = await is_admin(key, req.session.username);

        // If admin allow access
        if (admin_status) {

            const today = new Date();
            const month = months[today.getMonth()];
            const day = today.getDate();
            const year = today.getFullYear();
            const formatted_date = `${month} ${day}, ${year}`;
            let id = crypto.randomBytes(16).toString("hex");
            let article_image_file = req.files["article-image"];
            let article_html_file = req.files["article-html"];

            let article_entry = {
                "title": req.body["article-title"],
                "date": formatted_date,
                "image": article_image_file[0]["filename"],
                "html_file": article_html_file[0]["filename"],
                "description": req.body["article-description"],
                "id": id
            };

            // Store in list
            let store = await storage_client.rPush("articles", JSON.stringify(article_entry));
            // Redirect to article list
            res.redirect("/articles_list")
        } else {
            // Send failure notification
            res.send({ status: 0, message: "Insufficient privilges." });
        }
    } else {
        // Send failure notification
        res.send({ status: 0, message: "Insufficient privilges." });
    }
});