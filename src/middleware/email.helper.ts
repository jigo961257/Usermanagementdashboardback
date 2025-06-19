import nodemailer from "nodemailer";
import path from "path";
import handlebars from "handlebars";
import { readHTMLFile } from "../utils/dbUtils";
import { emailConfig } from "../config/emailConfig";
const sendEmail = async (to: string, subject: string, template: string) => {
  try {
    console.log("emaill..",emailConfig)
    const transporter = emailConfig.IS_EMAIL_USE_SMTP === "on"
      ? nodemailer.createTransport({
          host: emailConfig.EMAIL_HOST,
          port: emailConfig.EMAIL_PORT,
          secure: emailConfig.EMAIL_PORT === 465,
          auth: {
            user: emailConfig.FROM_EMAIL,
            pass: emailConfig.EMAIL_PASSWORD,
          },
        })
      : nodemailer.createTransport({
          sendmail: true,
          newline: "unix",
          path: "/usr/sbin/sendmail",
        });

    const mailOptions = {
      from: emailConfig.FROM_EMAIL,
      to,
      subject,
      html: template,
    };

    if (to) {
        console.log("tooooooooo",mailOptions)
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info);
    }
  } catch (e) {
    console.error("Email sending failed:", e);
  }
};

const emailSender = (to: string, subject: string, data: any, template: string) => {
  readHTMLFile(path.join(__dirname, `../../src/email_teamplates/${template}.html`), async (err: any, html: any) => {
    if (err) {
      console.error("Template reading failed:", err);
      return;
    }

    try {
      const compiledTemplate = handlebars.compile(html);
      const htmlToSend = compiledTemplate(data);
      console.log("htllll",htmlToSend)
      await sendEmail(to, subject, htmlToSend);
    } catch (e) {
      console.error("Template compiling failed:", e);
    }
  });
};

export { emailSender };
