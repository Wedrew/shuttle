import { Router } from 'express'
import { session_client } from '../db/session_client.js';
import { storage_client } from '../db/storage_client.js';
import { is_admin } from "../routes/auth.js";

export const router = Router();

// Articles list page
router.get('/', async function (req, res) {
    let articles = [];
    try {
        let key = "articles";
        const result = await storage_client.lRange(key, 0, -1);
        result.forEach(v => articles.push(JSON.parse(v)));
    } catch (err) {
        console.error(err);
    }

    // If logged in, display login info, else display login page
    if (req.session.loggedin) {
        let key = "admins";
        const admin_status = await is_admin(key, req.session.username);

        if (admin_status) {
            res.render("pages/index", {
                page: '../partials/articles_list',
                css: "/css/default.css",
                articles_list: articles,
                admin: true
            });
        }
    } else {
        res.render("pages/index", {
            page: '../partials/articles_list',
            css: "/css/default.css",
            articles_list: articles,
            admin: false
        });
    }
});