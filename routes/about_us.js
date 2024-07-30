import { Router } from 'express'

export const router = Router();

// About Me page
router.get('/', async function(req, res) {
    res.render("pages/index", {
        page: '../partials/about_us',
        css: "/css/default.css"
    });
});

router.post("/", async function(req, res) {
    res.send("User List");
});