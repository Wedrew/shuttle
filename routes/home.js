import { Router } from 'express'

export const router = Router();

// Index page
router.get('/', async function (req, res) {
    res.render("pages/index", {
        page: '../partials/home',
        css: "/css/home.css"
    });
});

// Home page
router.get('/home', async function (req, res) {
    res.render("pages/index", {
        page: '../partials/home',
        css: "/css/home.css"
    });
});
