const nodemailer = require("nodemailer");

module.exports = async ({ email, resetLink }) => {
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
            from: 'replace email here',
            to: email,  
            subject: "Password Reset Request",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   ${resetLink} \n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error("Failed to send password reset email");
        console.error(error);
        return error;
    }
};
 