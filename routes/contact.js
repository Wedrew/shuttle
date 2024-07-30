import { Router } from 'express'
import multer from 'multer';
import nodemailer from "nodemailer";

export const router = Router();

const form_parser = multer();

// Contact page
router.get('/', async function (req, res) {
    res.render("pages/index", {
        page: '../partials/contact',
        css: "/css/default.css"
    });
});

// Contact form submissions
router.post('/contact-form', form_parser.fields([]), async function (req, res) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // String formatting using backticks
    let email_text = `Dear ${req.body["first-name"]},\n
Thank you for reaching out! I'm excited to hear from you and appreciate your interest in connecting.\n
First name: ${req.body["first-name"]}\n
Last name: ${req.body["last-name"]}\n
Company: ${req.body["company"]}\n
Email: ${req.body["email"]}\n
Phone number: ${req.body["phone-number"]}\n
Submitted Message: ${req.body["message"]}\n`;

    const mail_options = {
        from: process.env.EMAIL_ADDRESS,
        to: req.body["email"],
        subject: 'Thank you for your message!',
        text: email_text,
        bcc: process.env.EMAIL_ADDRESS
    };

    transporter.sendMail(mail_options, function (error, info) {
        if (error) {
            res.send({ status: 0, message: "Failed to submit form." });
        } else {
            res.send({ status: 1, message: "Form submitted successfully." });
        }
    });
});