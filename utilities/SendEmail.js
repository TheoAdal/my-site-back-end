const nodemailer = require("nodemailer");

module.exports = async (email, verificationLink) => {
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
            subject: "Verification Email",
            text: `Congragulations, and welcome to the MY-SITE team,\n\n
                    only one step remains to activate your account, click the link below to verify your account:
                   ${verificationLink} \n\n`,
        };
       
		await transporter.sendMail(mailOptions);
		console.log("Verification email sent successfully");
	} catch (error) {
		console.log("Failed to send verification email not sent!");
		console.log(error);
		return error;
	}
};