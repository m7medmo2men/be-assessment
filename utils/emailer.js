const nodemailer = require("nodemailer");

class Emailer {
    constructor(reciever) {
        this.from = process.env.EMAIL_FROM;
        this.to = reciever;
    }

    createTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async send(mailOptions) {
        try {
            const transporter = this.createTransport();
            await transporter.sendMail({ from: this.from, ...mailOptions });
        } catch (error) {
            console.log("Error sending email", error);
        }
    }

    async sendVerificationEmail(token) {
        const mailOptions = {
            to: this.to,
            subject: "Verify your email address",
            html: `<h1>Welcome to Bosta</h1>
            <p>Click on the link below to verify your email</p>
            <a href="http://localhost:3000/api/users/verify/${token}">Verify</a>`,
        };
        await this.send(mailOptions);
    }

    async sendUrlDownNotification() {
        const mailOptions = {
            to: this.to,
            subject: "URL is down",
            html: `<h1>URL is down</h1>`,
        };
        await this.send(mailOptions);
    }

    async sendUrlUpNotification() {
        const mailOptions = {
            to: this.to,
            subject: "URL is UP",
            html: `<h1>URL is UP</h1>`,
        };
        await this.send(mailOptions);
    }
}

module.exports = Emailer;
