import { Router } from 'express'
import multer from 'multer';
import { session_client } from '../db/session_client.js';
import { storage_client } from '../db/storage_client.js';

export const router = Router();

export async function is_admin(key, user) {
    let found = false;
    const result = await storage_client.lRange(key, 0, -1);
    result.forEach(v => {if(v == user) {found = true};});

    return found;
}

const form_parser = multer();

// Auth page
router.get('/', async function (req, res) {
    // If logged in, display login info, else display login page
    if (req.session.loggedin) {
        res.render("pages/index", {
            page: '../partials/profile',
            css: "/css/default.css",
            user: req.session.username
        });
    } else {
        res.render("pages/index", {
            page: '../partials/login',
            css: "/css/default.css"
        });
    }
})

// Logout
router.delete('/logout', function (req, res) {
    if (req.session) {
        // Redirect to home page
        req.session.destroy((err) => {
            res.redirect('/home');
        });
    } else {
        res.end()
    }
})

// Login form
router.post('/login-form', form_parser.fields([]), async function (req, res) {
    // Capture the input fields
    let form_username = req.body.username;
    let form_password = req.body.password;
    let key = "users";

    if (form_username && form_password) {
        try {
            // Check if username exists within hash  
            const exists = await storage_client.hExists(key, form_username);

            // If it does exist, check if password is correct
            if (exists) {
                let redis_password = await storage_client.hGet(key, form_username);
                if (redis_password == form_password) {
                    // Authenticate the user
                    req.session.loggedin = true;
                    req.session.username = form_username;

                    // Send success notification
                    res.redirect("/auth");
                } else {
                    // Send failure notification
                    res.send({ status: 0, message: "The username-password combination you entered is incorrect." });
                }
            } else {
                // Send failure notification
                res.send({ status: 0, message: "The username-password combination you entered is incorrect." });
            }
        } catch (err) {
            console.error(err);
        }
    } else {
        // Send failure notification
        res.send({ status: 0, message: "Username or password was empty" });
    }
})
