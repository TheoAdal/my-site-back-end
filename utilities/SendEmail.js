const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.USER,
				pass: process.env.USER_PASS,
			},
		});

        const mailOptions = {
            from: 'replace email here',
            to: email,  
            subject: "Password Reset Request",
            text: `Congragulations, and welcome to the MY-SITE team,\n\n
                    only one step remains to activate your account, click the link below to verify your account:
                   ${verificationLink} \n\n`,
        };
       
		await transporter.sendMail(mailOptions);
		console.log("Verification email sent successfully");
	} catch (error) {
		console.log("Email not sent!");
		console.log(error);
		return error;
	}
};