const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

app.post('/api/send-email', (req, res) => {
    const { name, email, subject, message, whatsapp } = req.body;

    // Create a Nodemailer transporter using your email service credentials
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., 'Gmail'
        auth: {
            user: 'your-email@gmail.com', // Replace with your email
            pass: 'your-email-password' // Replace with your password or an app-specific password
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com', // Replace with your email
        to: 'techbrvictoria@gmail.com',
        subject: `Contact Form Submission: ${subject}`,
        html: `
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Subject: ${subject}</p>
            <p>Message: ${message}</p>
            <p>Wants WhatsApp: ${whatsapp === 'on' ? 'Yes' : 'No'}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ success: false, message: 'Error sending email' });
        } else {
            console.log('Email sent: ' + info.response);
            res.send({ success: true, message: 'Email sent successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
