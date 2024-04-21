const nodemailer = require("nodemailer");
const pug = require("pug");

module.exports = class Email {
  constructor(user, firstName) {
    this.to = user.email;
    this.firstName = firstName;
    this.from = `Application Support ${process.env.EMAIL_SUPPORT}`;
  }

  newTransport() {
    if (process.env.NODE_ENV.match("production")) {
      //sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async send(subject, template, url) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      subject,
      url,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: html.toString(),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcomeMessage() {
    await this.send("Welcome!", "welcome", " ");
  }
};
