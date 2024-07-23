import { Router } from 'express'

export const router = Router();

// Lost page
router.get('/', async function (req, res) {
    res.render("pages/index", {
        page: '../partials/lost',
        css: "/css/default.css"
    });
});

// Unimplemented
router.get('/unimplemented', async function (req, res) {
    res.render("pages/index", {
        page: '../partials/unimplemented',
        css: "/css/default.css"
    });
});