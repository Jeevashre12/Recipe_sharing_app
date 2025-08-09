import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});


transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP ERROR:", err);
  } else {
    console.log("SMTP connected.");
  }
});

export default transporter;
