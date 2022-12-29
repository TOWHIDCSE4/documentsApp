import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: process.env.MAIL_PORT || 587,
  secure: process.env.MAIL_SECURE == "1" ? true : false, // upgrade later with STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

class Mail {
  static send(to, subject, content, variables = {}) {
    content = this.makeContent(content, variables)
    subject = this.makeContent(subject, variables)

    var mailOptions = {
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: to,
      subject: subject,
      html: content
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  static makeContent(content, variables = {}) {
    for(let key in variables) {
      let regex = `\\{\\{${key}\\}\\}`
      let re = new RegExp(regex, "g");
      content = content.replace(re, variables[key])
    }
    return content
  }
}

export default Mail
