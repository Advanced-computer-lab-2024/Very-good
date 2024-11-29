const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    try {
        // Configure the email transport
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to another service
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or app password
            },
        });

        // Set up email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to, // Recipient email
            subject, // Email subject
            text, // Email body
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendEmail;
