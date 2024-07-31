import { Router } from 'express'
import multer from 'multer';
import { session_client } from '../db/session_client.js';
import { storage_client } from '../db/storage_client.js';
import nodemailer from "nodemailer";


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
    res.render("pages/index", {
        page: '../partials/signup',
        css: "/css/default.css"
    });
})

// Signup form
router.post('/signup-form', form_parser.fields([]), async function (req, res) {
    // Capture the input fields
    let form_username = req.body.username;
    let form_password = req.body.password;
    let key = "users";

    if (form_username && form_password) {
        try {
            // Check if username exists within hash  
            const exists = await storage_client.hExists(key, form_username);

            // If it does not exist
            if (!exists) {
                const temp = await storage_client.hSet(key, form_username, form_password);

                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.EMAIL_ADDRESS,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
            
                // String formatting using backticks
                let email_text = `Dear ${form_username},\nThank you for signing up for Shuttle!`;
            
                const mail_options = {
                    from: process.env.EMAIL_ADDRESS,
                    to: req.body["email"],
                    subject: 'Sign up',
                    text: email_text
                };
            
                transporter.sendMail(mail_options, function (error, info) {
                    if (error) {
                        res.send({ status: 0, message: "Failed to complete signup form." });
                    } else {
                        res.send({ status: 1, message: "Signed up successfully." });
                        // Send success notification
                        res.redirect("/auth");
                    }
                });            
            } else {
                // Send failure notification
                res.send({ status: 0, message: "The username " + form_username + " already exists" });
            }
        } catch (err) {
            console.error(err);
        }
    } else {
        // Send failure notification
        res.send({ status: 0, message: "Username or password was empty" });
    }
})
