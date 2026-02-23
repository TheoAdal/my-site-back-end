const nodemailer = require("nodemailer");

module.exports = async (email, sender_name, sender_email, sender_text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS,
            },
        });

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,  
            subject: `New Contact from ${sender_name}`,
            text: `Greetings boss, \n
                   You got a new message from ${sender_name}:\n
                   Sender email: ${sender_email}\n
                   Sender Message: ${sender_text}\n`,
        };
       
        await transporter.sendMail(mailOptions);
        console.log("Contact email sent successfully");
    } catch (error) {
        console.log("Failed to send contact email");
        console.log(error);
        return error;
    }
};