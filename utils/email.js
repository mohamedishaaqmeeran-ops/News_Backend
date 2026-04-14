const nodemailer = require('nodemailer');
const { EMAIL_USER, GOOGLE_APP_PASSWORD } = require('../utils/config');
console.log(EMAIL_USER)
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: GOOGLE_APP_PASSWORD
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject,
        text,
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    
}

module.exports = sendEmail;